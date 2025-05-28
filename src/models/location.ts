import { Object, Column, type StaticDecode, asString } from 'sheethuahua';

export const locationTable = Object({
	province: Column('จังหวัด', asString()),
	name: Column('ชื่อสถานที่', asString()),
	description: Column('คำอธิบาย', asString()),
	openingTime: Column('วันและเวลาที่เปิด', asString().optional()),
	contact: Column('ติดต่อ', asString().optional()),
	address: Column('ที่อยู่', asString().optional()),
	mapUrl: Column('Google Map Link', asString().optional()),
});

export type Location = StaticDecode<typeof locationTable>;
