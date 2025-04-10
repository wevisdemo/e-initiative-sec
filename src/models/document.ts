import type { Timestamp } from 'firebase/firestore';
import {
	Object,
	Column,
	type StaticDecode,
	asString,
	asOneOf,
} from 'sheethuahua';

export const MAX_LOCATION_LENGTH = 20;

export const documentsTable = Object({
	location: Column(
		'location',
		asString({ minLength: 1, maxLength: MAX_LOCATION_LENGTH }),
	),
	prefix: Column('prefix', asOneOf(['นาย', 'นาง', 'นางสาว'])),
	firstname: Column('firstname', asString({ minLength: 1 })),
	lastname: Column('lastname', asString({ minLength: 1 })),
});

export const organizeTable = Object({
	organizeName: Column('location', asString({ minLength: 1 })),
});

export type FormDocument = StaticDecode<typeof documentsTable>;

export type FormOrganize = StaticDecode<typeof organizeTable>;

export interface SubmittedDocument extends FormDocument {
	uid: string;
	timestamp: Pick<Timestamp, 'seconds' | 'nanoseconds'>;
}

export interface SubmittedOrganize extends FormOrganize {
	uid: string;
	timestamp: Pick<Timestamp, 'seconds' | 'nanoseconds'>;
}
