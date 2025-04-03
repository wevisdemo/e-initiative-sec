<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createForm } from 'felte';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import SignaturePad from 'signature_pad';
	import { Value } from '@sinclair/typebox/value';
	import PenIcon from '../icons/PenIcon.svelte';
	import ResetIcon from '../icons/ResetIcon.svelte';
	import CheckmarkIcon from '../icons/CheckmarkIcon.svelte';
	import { documentsTable, MAX_LOCATION_LENGTH } from '../../models/document';
	import { submitDocument } from '../../utils/firebase';
	import { validateCitizenId } from '../../utils/validater';

	let successDialog: HTMLDialogElement;
	let errorDialog: HTMLDialogElement;
	let canvasResizeObserver: ResizeObserver;
	let signatureEnabled = false;
	let isLoading = false;

	const { form, setTouched, setData, data, reset } = createForm({
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.location) {
				errors.location = 'ระบุจังหวัดที่คุณอยู่อาศัย  ';
			}

			if (!/^[ก-๙\s]+$/.test(values.firstname)) {
				errors.firstname = 'ระบุชื่อจริงเป็นภาษาไทย  ';
			}

			if (!/^[ก-๙\s]+$/.test(values.lastname)) {
				errors.lastname = 'ระบุนามสกุลเป็นภาษาไทย';
			}

			return errors;
		},
		async onSubmit(values) {
			isLoading = true;
			try {
				if (!Value.Check(documentsTable, values)) {
					throw [...Value.Errors(documentsTable, values)];
				}
				await submitDocument(values);
				successDialog.showModal();

				reset();
			} catch (e) {
				errorDialog.showModal();
			}
			isLoading = false;
		},
		extend: reporter,
	});
</script>

<form use:form class="form-control w-full">
	<div class="form-control flex-1">
		<ValidationMessage for="location" let:messages>
			<label class="label" for="location">
				<span class="body-03 label-text font-bold">จังหวัด*</span>
			</label>
			<select
				name="location"
				class="select w-full rounded-md bg-base-200 {messages
					? 'input-error'
					: ''}"
				disabled={isLoading}
			>
				<option value="" selected disabled>เลือกจังหวัด</option>
				<option>กรุงเทพมหานคร</option>
				<option>กระบี่</option>
				<option>กาญจนบุรี</option>
				<option>กาฬสินธุ์</option>
				<option>กำแพงเพชร</option>
				<option>ขอนแก่น</option>
				<option>จันทบุรี</option>
				<option>ฉะเชิงเทรา</option>
				<option>ชลบุรี</option>
				<option>ชัยนาท</option>
				<option>ชัยภูมิ</option>
				<option>ชุมพร</option>
				<option>เชียงราย</option>
				<option>เชียงใหม่</option>
				<option>ตรัง</option>
				<option>ตราด</option>
				<option>ตาก</option>
				<option>นครนายก</option>
				<option>นครปฐม</option>
				<option>นครพนม</option>
				<option>นครราชสีมา</option>
				<option>นครศรีธรรมราช</option>
				<option>นครสวรรค์</option>
				<option>นนทบุรี</option>
				<option>นราธิวาส</option>
				<option>น่าน</option>
				<option>บึงกาฬ</option>
				<option>บุรีรัมย์</option>
				<option>ปทุมธานี</option>
				<option>ประจวบคีรีขันธ์</option>
				<option>ปราจีนบุรี</option>
				<option>ปัตตานี</option>
				<option>พระนครศรีอยุธยา</option>
				<option>พังงา</option>
				<option>พัทลุง</option>
				<option>พิจิตร</option>
				<option>พิษณุโลก</option>
				<option>เพชรบุรี</option>
				<option>เพชรบูรณ์</option>
				<option>แพร่</option>
				<option>ภูเก็ต</option>
				<option>มหาสารคาม</option>
				<option>มุกดาหาร</option>
				<option>แม่ฮ่องสอน</option>
				<option>ยโสธร</option>
				<option>ยะลา</option>
				<option>ร้อยเอ็ด</option>
				<option>ระนอง</option>
				<option>ระยอง</option>
				<option>ราชบุรี</option>
				<option>ลพบุรี</option>
				<option>ลำปาง</option>
				<option>ลำพูน</option>
				<option>เลย</option>
				<option>ศรีสะเกษ</option>
				<option>สกลนคร</option>
				<option>สงขลา</option>
				<option>สตูล</option>
				<option>สมุทรปราการ</option>
				<option>สมุทรสงคราม</option>
				<option>สมุทรสาคร</option>
				<option>สระแก้ว</option>
				<option>สระบุรี</option>
				<option>สิงห์บุรี</option>
				<option>สุโขทัย</option>
				<option>สุพรรณบุรี</option>
				<option>สุราษฎร์ธานี</option>
				<option>สุรินทร์</option>
				<option>หนองคาย</option>
				<option>หนองบัวลำภู</option>
				<option>อ่างทอง</option>
				<option>อำนาจเจริญ</option>
				<option>อุดรธานี</option>
				<option>อุตรดิตถ์</option>
				<option>อุทัยธานี</option>
				<option>อุบลราชธานี</option>
			</select>
			<div class="label">
				<span class="body-01 {messages ? 'text-error' : ''}"
					>ระบุจังหวัดที่คุณอยู่อาศัย</span
				>
			</div>
		</ValidationMessage>
	</div>
	<div class="flex flex-row space-x-[10px]">
		<div class="form-control">
			<label class="label" for="prefix">
				<span class="body-03 label-text font-bold">คำนำหน้า</span>
			</label>
			<select
				class="select max-w-xs rounded-md bg-base-200"
				disabled={isLoading}
				name="prefix"
			>
				<option selected />
				<option>นาย</option>
				<option>นาง</option>
				<option>นางสาว</option>
			</select>
		</div>
		<div class="form-control flex-1">
			<ValidationMessage for="firstname" let:messages>
				<label class="label" for="firstname">
					<span class="body-03 label-text font-bold">ชื่อ*</span>
				</label>
				<input
					type="text"
					name="firstname"
					class="input w-full rounded-md bg-base-200 {messages
						? 'input-error'
						: ''}"
					disabled={isLoading}
				/>
				<div class="label">
					<span class="body-01 {messages ? 'text-error' : ''}"
						>ระบุชื่อจริงเป็นภาษาไทย</span
					>
				</div>
			</ValidationMessage>
		</div>
	</div>
	<ValidationMessage for="lastname" let:messages>
		<label class="label" for="lastname">
			<span class="body-03 label-text font-bold">นามสกุล*</span>
		</label>
		<input
			type="text"
			name="lastname"
			class="input rounded-md bg-base-200 {messages ? 'input-error' : ''}"
			disabled={isLoading}
		/>
		<div class="label">
			<span class="body-01 {messages ? 'text-error' : ''}"
				>ระบุนามสกุลเป็นภาษาไทย</span
			>
		</div>
	</ValidationMessage>
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
