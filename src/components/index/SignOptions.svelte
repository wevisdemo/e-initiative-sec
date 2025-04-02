<script lang="ts">
	import Config from '../../../e-initiative.config.mjs';
	import SignOnlineForm from './SignOnlineForm.svelte';
	import LocationIcon from '../icons/LocationIcon.svelte';
	import DocumentIcon from '../icons/DocumentIcon.svelte';
	import SignOnlineFormOrganize from './SignOnlineFormOrganize.svelte';
	import CardContainer from './CardContainer.svelte';
	import StepBlock from './StepBlock.svelte';
	import PostAddress from './PostAddress.svelte';
	import HeadquarterMap from './HeadquarterMap.svelte';

	enum Channels {
		Persernal = 'บุคคล',
		Organize = 'กลุ่ม/องค์กร',
	}

	let selectedChannel: Channels = Channels.Persernal;
</script>

<div class="flex flex-1 flex-col gap-6">
	{#if Config.petition.offline}
		<div class="join">
			{#each Object.values(Channels) as option}
				<input
					class="heading-03 btn join-item flex-1 !border-base-100 !bg-base-100 opacity-50 checked:opacity-100"
					type="radio"
					name="channel"
					aria-label={option}
					value={option}
					bind:group={selectedChannel}
				/>
			{/each}
		</div>
	{/if}

	{#if selectedChannel === Channels.Persernal}
		<CardContainer>
			<SignOnlineForm />
		</CardContainer>
	{:else if Config.petition.offline}
		<CardContainer>
			<SignOnlineFormOrganize />
		</CardContainer>
	{/if}
</div>
