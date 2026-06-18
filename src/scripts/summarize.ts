import { readFileSync, writeFileSync } from 'fs';
import { csvFormat, csvParse } from 'd3-dsv';
import { OUTPUT_DIR } from './constants';

const INPUT_FILE = `${OUTPUT_DIR}/people.csv`;
const PROVINCE_OUTPUT = `${OUTPUT_DIR}/people-by-province.csv`;
const REGION_OUTPUT = `${OUTPUT_DIR}/people-by-region.csv`;

const REGION_LABEL = {
	north: 'ภาคเหนือ',
	northeast: 'ภาคตะวันออกเฉียงเหนือ',
	west: 'ภาคตะวันตก',
	central: 'ภาคกลาง',
	east: 'ภาคตะวันออก',
	south: 'ภาคใต้',
	unknown: 'ไม่ระบุ',
} as const;

const provinceToRegion: Record<string, string> = {
	// ภาคเหนือ (17 Provinces)
	เชียงใหม่: REGION_LABEL.north,
	เชียงราย: REGION_LABEL.north,
	ลำปาง: REGION_LABEL.north,
	ลำพูน: REGION_LABEL.north,
	แม่ฮ่องสอน: REGION_LABEL.north,
	น่าน: REGION_LABEL.north,
	พะเยา: REGION_LABEL.north,
	แพร่: REGION_LABEL.north,
	อุตรดิตถ์: REGION_LABEL.north,
	ตาก: REGION_LABEL.north, // Frequently grouped here; alternatively West, but usually North in 6-region
	สุโขทัย: REGION_LABEL.north,
	พิษณุโลก: REGION_LABEL.north,
	พิจิตร: REGION_LABEL.north,
	กำแพงเพชร: REGION_LABEL.north,
	เพชรบูรณ์: REGION_LABEL.north,
	นครสวรรค์: REGION_LABEL.north,
	อุทัยธานี: REGION_LABEL.north,

	// ภาคตะวันออกเฉียงเหนือ (20 Provinces)
	อำนาจเจริญ: REGION_LABEL.northeast,
	บึงกาฬ: REGION_LABEL.northeast,
	บุรีรัมย์: REGION_LABEL.northeast,
	ชัยภูมิ: REGION_LABEL.northeast,
	กาฬสินธุ์: REGION_LABEL.northeast,
	ขอนแก่น: REGION_LABEL.northeast,
	เลย: REGION_LABEL.northeast,
	มหาสารคาม: REGION_LABEL.northeast,
	มุกดาหาร: REGION_LABEL.northeast,
	นครพนม: REGION_LABEL.northeast,
	นครราชสีมา: REGION_LABEL.northeast,
	หนองบัวลำภู: REGION_LABEL.northeast,
	หนองคาย: REGION_LABEL.northeast,
	ร้อยเอ็ด: REGION_LABEL.northeast,
	สกลนคร: REGION_LABEL.northeast,
	ศรีสะเกษ: REGION_LABEL.northeast,
	สุรินทร์: REGION_LABEL.northeast,
	อุบลราชธานี: REGION_LABEL.northeast,
	อุดรธานี: REGION_LABEL.northeast,
	ยโสธร: REGION_LABEL.northeast,

	// ภาคตะวันตก (5 Provinces)
	// ตาก: REGION_LABEL.west, // Left here if strictly sticking to physical geography system
	กาญจนบุรี: REGION_LABEL.west,
	ราชบุรี: REGION_LABEL.west,
	เพชรบุรี: REGION_LABEL.west, // Moved from South
	ประจวบคีรีขันธ์: REGION_LABEL.west, // Moved from South

	// ภาคกลาง (22 Provinces)
	อ่างทอง: REGION_LABEL.central,
	กรุงเทพมหานคร: REGION_LABEL.central,
	ชัยนาท: REGION_LABEL.central,
	ลพบุรี: REGION_LABEL.central,
	นครปฐม: REGION_LABEL.central,
	นนทบุรี: REGION_LABEL.central,
	ปทุมธานี: REGION_LABEL.central,
	พระนครศรีอยุธยา: REGION_LABEL.central,
	สมุทรปราการ: REGION_LABEL.central,
	สมุทรสาคร: REGION_LABEL.central,
	สมุทรสงคราม: REGION_LABEL.central,
	สระบุรี: REGION_LABEL.central,
	สิงห์บุรี: REGION_LABEL.central,
	สุพรรณบุรี: REGION_LABEL.central,
	นครนายก: REGION_LABEL.central, // Moved from East

	// ภาคตะวันออก (7 Provinces)
	ฉะเชิงเทรา: REGION_LABEL.east,
	จันทบุรี: REGION_LABEL.east,
	ชลบุรี: REGION_LABEL.east,
	ปราจีนบุรี: REGION_LABEL.east,
	ระยอง: REGION_LABEL.east,
	สระแก้ว: REGION_LABEL.east,
	ตราด: REGION_LABEL.east,

	// ภาคใต้ (14 Provinces)
	ชุมพร: REGION_LABEL.south,
	นครศรีธรรมราช: REGION_LABEL.south,
	นราธิวาส: REGION_LABEL.south,
	ปัตตานี: REGION_LABEL.south,
	พัทลุง: REGION_LABEL.south,
	สงขลา: REGION_LABEL.south,
	สุราษฎร์ธานี: REGION_LABEL.south,
	ยะลา: REGION_LABEL.south,
	กระบี่: REGION_LABEL.south,
	พังงา: REGION_LABEL.south,
	ภูเก็ต: REGION_LABEL.south,
	ระนอง: REGION_LABEL.south,
	สตูล: REGION_LABEL.south,
	ตรัง: REGION_LABEL.south,
};

interface PersonRow {
	fullname: string;
	location: string;
	date: string;
}

interface SummaryRow {
	group: string;
	count: number;
}

const raw = readFileSync(INPUT_FILE, 'utf-8');
const people = csvParse(raw) as PersonRow[];

const provinceCounts = countBy(people, (p) => p.location.trim());
const regionCounts = countBy(people, (p) => {
	const province = p.location.trim();
	return provinceToRegion[province] ?? REGION_LABEL.unknown;
});

writeFileSync(PROVINCE_OUTPUT, csvFormat(formatSummary(provinceCounts)));

writeFileSync(REGION_OUTPUT, csvFormat(formatSummary(regionCounts)));

console.log(`Wrote ${PROVINCE_OUTPUT}`);
console.log(`Wrote ${REGION_OUTPUT}`);

function countBy<T>(
	items: T[],
	keyFn: (item: T) => string,
): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const item of items) {
		const key = keyFn(item);
		counts[key] = (counts[key] ?? 0) + 1;
	}
	return counts;
}

function formatSummary(counts: Record<string, number>): SummaryRow[] {
	return Object.entries(counts)
		.map(([group, count]) => ({ group, count }))
		.sort((a, b) => b.count - a.count);
}
