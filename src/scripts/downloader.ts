import {
	writeFileSync,
	readdirSync,
	readFileSync,
	mkdirSync,
	existsSync,
} from 'fs';
import { Timestamp } from 'firebase/firestore';
import { getDocuments, getOrganizes } from '../utils/firebase';
import type { SubmittedDocument, SubmittedOrganize } from '../models/document';
import { csvFormat } from 'd3-dsv';
import { OUTPUT_DIR } from './constants';

const TEMP_DIR = `${OUTPUT_DIR}/.tmp`;
const PAGE_LIMIT = 1000;

let lastTimestamp: Timestamp | undefined;
let lastOrganizeName: string | undefined;
let batchCount = 1;
let isCompleted = false;

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR);
if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR);

console.log('Retrieving documents...');

do {
	const documents = await getDocuments(PAGE_LIMIT, lastTimestamp);

	lastTimestamp = documents.at(-1)?.timestamp as Timestamp | undefined;

	console.log(
		`Batch ${batchCount}: ${documents.length} documents retrieved`,
		lastTimestamp
			? `(last timestamp: ${lastTimestamp.toDate().toISOString()})`
			: '',
	);

	writeFileSync(
		`${TEMP_DIR}/documents-raw-${batchCount}.json`,
		JSON.stringify(documents),
	);

	batchCount++;
	isCompleted = documents.length < PAGE_LIMIT;
} while (!isCompleted);

batchCount = 1;
isCompleted = false;

const documents = readdirSync(TEMP_DIR)
	.filter((path) => path.startsWith('documents-raw-') && path.endsWith('.json'))
	.reduce<SubmittedDocument[]>((list, path) => {
		list.push(...JSON.parse(readFileSync(`${TEMP_DIR}/${path}`, 'utf-8')));
		return list;
	}, []);

console.log(`Original data has ${documents.length} rows`);

const people = documents
	.filter((s) => s.firstname.length > 1 && s.lastname.length > 1)
	.sort((z, a) => z.timestamp.seconds - a.timestamp.seconds)
	.filter(checkDuplicatedKeys(['firstname', 'lastname', 'prefix', 'location']))
	.sort((z, a) => a.timestamp.seconds - z.timestamp.seconds)
	.map(({ prefix, firstname, lastname, timestamp, location }) => {
		return {
			fullname: `${prefix.trim()} ${firstname.trim()} ${lastname.trim()}`,
			location: location.trim(),
			date: new Date(timestamp.seconds * 1000),
		};
	});

console.log(`Got ${people.length} people after cleaning`);

writeFileSync(`${OUTPUT_DIR}/people.csv`, csvFormat(people));

console.log('Retrieving organizes...');

do {
	const organizes = await getOrganizes(PAGE_LIMIT, lastOrganizeName);

	lastOrganizeName = organizes.at(-1)?.organizeName;

	console.log(
		`Batch ${batchCount}: ${organizes.length} organizations retrieved`,
		lastOrganizeName ? `(last name: ${lastOrganizeName})` : '',
	);

	writeFileSync(
		`${TEMP_DIR}/organizes-raw-${batchCount}.json`,
		JSON.stringify(organizes),
	);

	batchCount++;
	isCompleted = organizes.length < PAGE_LIMIT;
} while (!isCompleted);

const organizes = readdirSync(TEMP_DIR)
	.filter((path) => path.startsWith('organizes-raw-') && path.endsWith('.json'))
	.reduce<OrganizeRecord[]>((list, path) => {
		list.push(...JSON.parse(readFileSync(`${TEMP_DIR}/${path}`, 'utf-8')));
		return list;
	}, []);

console.log(`Original organize data has ${organizes.length} rows`);

const organizationRows = organizes
	.filter((o) => o.organizeName.length > 1)
	.sort((z, a) => z.timestamp.seconds - a.timestamp.seconds)
	.filter(checkDuplicatedKeys(['organizeName']))
	.map(({ organizeName, timestamp, ...rest }) => {
		return {
			name: organizeName.trim(),
			email: (rest as { mail?: string }).mail?.trim() ?? '',
			phone: (rest as { phoneNo?: string }).phoneNo?.trim() ?? '',
			date: new Date(timestamp.seconds * 1000),
		};
	});

console.log(`Got ${organizationRows.length} organizations after cleaning`);

writeFileSync(`${OUTPUT_DIR}/organizations.csv`, csvFormat(organizationRows));

console.log(`Write CSV files into ${OUTPUT_DIR} successfully!`);

process.exit(0);

function checkDuplicatedKeys<T extends Object>(keys: (keyof T)[]) {
	return (obj1: T, i: number, arr: T[]) =>
		arr.findIndex((obj2) => keys.every((key) => obj2[key] === obj1[key])) === i;
}

function formatSignatoriesWithSignature({
	fullname,
	location,
	date,
}: (typeof people)[number]) {
	const [day, month, year] = date
		.toLocaleDateString('TH-th', { dateStyle: 'long' })
		.split(' ');

	return {
		fullname,
		location,
		day,
		month,
		year,
	};
}

interface OrganizeRecord extends SubmittedOrganize {
	mail?: string;
	phoneNo?: string;
}

export type SignatoriesWithSignature = ReturnType<
	typeof formatSignatoriesWithSignature
>;
