<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import SignaturePad from 'signature_pad';
	import { Value } from '@sinclair/typebox/value';
	import PenIcon from '../icons/PenIcon.svelte';
	import ResetIcon from '../icons/ResetIcon.svelte';
	import CheckmarkIcon from '../icons/CheckmarkIcon.svelte';
	import { organizeTable, MAX_LOCATION_LENGTH } from '../../models/document';
	import { submitOrganize } from '../../utils/firebase';
	import { validateCitizenId } from '../../utils/validater';

	let successDialog: HTMLDialogElement;
	let errorDialog: HTMLDialogElement;
	let canvasResizeObserver: ResizeObserver;
	let signatureEnabled = false;
	let isLoading = false;

	const { form, setTouched, setData, data, reset } = createForm({
		validate: (values) => {
			const errors = Object.fromEntries(
				[...Value.Errors(organizeTable, values)].map((e) => [
					e.path.replace('/', ''),
					e.message,
				]),
			);
			return errors;
		},
		async onSubmit(values) {
			isLoading = true;
			try {
				if (!Value.Check(organizeTable, values)) {
					throw [...Value.Errors(organizeTable, values)];
				}
				await submitOrganize(values);
				successDialog.showModal();

				reset();
			} catch (e) {
				console.log(e, 'catch');

				errorDialog.showModal();
			}
			isLoading = false;
		},
		extend: reporter,
	});
</script>

<form use:form class="form-control w-full">
	<div class="form-control flex-1">
		<ValidationMessage for="organizeName" let:messages>
			<label class="label" for="organizeName">
				<span class="body-03 label-text font-bold">กลุ่ม/องค์กร*</span>
			</label>
			<input
				type="string"
				name="organizeName"
				class="input rounded-sm bg-base-200 {messages ? 'input-error' : ''}"
				disabled={isLoading}
			/>
			<div class="label">
				<span class="body-01 {messages ? 'text-error' : ''}"
					>ระบุชื่อกลุ่ม/องค์กรของคุณ</span
				>
			</div>
		</ValidationMessage>
	</div>

	<div>
		<label class="label" for="mail">
			<span class="body-03 label-text font-bold">อีเมล (ไม่บังคับ)</span>
		</label>
		<input
			type="text"
			name="mail"
			class="input w-full rounded-md bg-base-200"
			disabled={isLoading}
		/>
		<div class="label">
			<span class="body-01"
				>E-mail ที่ใช้งานในปัจจุบัน สำหรับในกรณีติดต่อกลับ
				ข้อมูลจะเก็บเป็นความลับ</span
			>
		</div>
	</div>
	<div>
		<label class="label" for="phoneNo">
			<span class="body-03 label-text font-bold">เบอร์โทรศัพท์ (ไม่บังคับ)</span
			>
		</label>
		<input
			type="text"
			name="phoneNo"
			class="input w-full rounded-md bg-base-200"
			disabled={isLoading}
		/>
		<div class="label">
			<span class="body-01"
				>ระบุเบอร์โทรศัพท์ที่ใช้งานในปัจจุบัน สำหรับใน กรณีติดต่อกลับ
				ข้อมูลจะเก็บเป็นความลับ</span
			>
		</div>
	</div>
	<div class="form-control">
		<label class="label cursor-pointer justify-normal space-x-2">
			<input
				type="checkbox"
				name="consent"
				class=" checkbox border-2 border-neutral"
			/>
			<span class="label-text"
				>ข้าพเจ้ายินยอมลงชื่อ <a href="privacy-policy" class="underline"
					>อ่านนโยบายการคุ้มครองข้อมูลส่วนบุคคล</a
				></span
			>
		</label>
	</div>
	<button
		type="submit"
		class="body-03 btn btn-primary mt-2 w-full font-bold text-neutral disabled:text-base-100"
		disabled={!$data.consent || isLoading}
	>
		{#if !isLoading}
			ลงชื่อเลย
			<div class={!$data.consent || isLoading ? 'opacity-30' : ''}>
				<PenIcon />
			</div>
		{:else}
			กำลังลงชื่อ...
			<span class="loading loading-spinner" />
		{/if}
	</button>
</form>

<dialog bind:this={successDialog} class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box flex flex-col">
		<div class="flex flex-row items-center justify-center gap-1">
			<span class="text-success"><CheckmarkIcon /></span>
			<span>ลงชื่อสำเร็จ!</span>
		</div>
		<div class="modal-action">
			<button class="btn btn-block">ปิด</button>
		</div>
	</form>
</dialog>

<dialog bind:this={errorDialog} class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box flex flex-col">
		<p class="text-center">
			เกิดข้อผิดพลาดในการลงชื่อ โปรดลองลงชื่อใหม่อีกครั้ง
		</p>
		<div class="modal-action">
			<button class="btn btn-block">ปิด</button>
		</div>
	</form>
</dialog>
