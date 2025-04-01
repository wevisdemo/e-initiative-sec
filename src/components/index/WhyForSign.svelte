<script>
	let sections = [
		{
			index: 1,
			title: 'มุ่งส่งเสริมอุตสาหกรรม',
			content:
				'ร่างพระราชบัญญัติระเบียงเขตเศรษฐกิจพิเศษภาคใต้เป็นกฎหมายที่จะกำหนดให้พื้นที่ จังหวัดชุมพร ระนองสุราษฎร์ธานี และนครศรีธรรมราช เป็นพื้นที่สำหรับส่งเสริมอุตสาหกรรมเป็นหลัก.',
			image: 'industry.jpg',
		},
		{
			index: 2,
			title: 'รวบอำนาจทางกฎหมาย และผูกขาดการตัดสินใจ',
			content:
				'ด้วยการรวบอำนาจและการตัดสินใจในทางกฎหมายให้อยู่ในมือของคณะรัฐมนตรีชุดเล็ก ในนาม “คณะกรรมการนโยบายเขตเศรษฐกิจพิเศษภาคใต้”...',
			image: 'law.jpg',
		},
		{
			index: 3,
			title: 'SEC ทางด่วนของ Land Bridge',
			content:
				'ร่างกฎหมาย SEC เป็นกฎหมายที่เอื้อให้เกิดโครงการแลนด์บริดจ์ชุมพร-ระนอง ที่ประกอบด้วย 3 โครงการ คือ โครงการพัฒนาท่าเรือน้ำลึกแหลมริ่ว จ.ชุมพร...',
			image: 'landbridge.jpg',
		},
		{
			index: 4,
			title: 'แย่งยึดทรัพยากรและวีถีชีวิต',
			content:
				'ทรัพยากรธรรมชาติสิ่งแวดล้อมในพื้นที่ทะเล โดยเฉพาะพื้นที่จังหวัดระนอง “ขุมทองอันดามัน” เป็นแหล่งที่อยู่อาศัยและหล่อเลี้ยงชีวิตของสัตว์ และคนในพื้นที่...',
			image: 'environment.jpg',
		},
	];
</script>

<div>
	<h2 class="mb-6 text-center text-xl font-bold text-gray-800">
		ทำไมต้องหยุดกฎหมายพิเศษนี้!
	</h2>
	<div class="mx-auto overflow-hidden rounded-lg shadow-lg">
		<div class="relative">
			<img
				src="header.jpg"
				alt="header"
				class=" h-[78px] w-full object-cover"
			/>
			<div class="bg-primary absolute inset-0 flex items-center justify-center">
				<h1 class="text-neutral heading-responsive-01 text-center font-bold">
					สรุปใจความสำคัญของ พรบ.
				</h1>
			</div>
		</div>
		<div class="p-6">
			<div class="space-y-6">
				{#each sections as section}
					<div class="rounded-lgp-4 flex flex-col items-center md:flex-row">
						<!-- <img
							src={section.image}
							alt={section.title}
							class="h-24 w-24 rounded-lg object-cover md:h-32 md:w-32"
						/> -->

						<div class="mt-4 md:ml-4 md:mt-0">
							<h3 class="text-lg font-semibold text-gray-900">
								{section.index}
								{section.title}
							</h3>
							<p class="text-sm text-gray-700 md:text-base">
								{section.content}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
