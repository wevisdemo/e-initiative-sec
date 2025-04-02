import { Object, Column, type StaticDecode, asString } from 'sheethuahua';

export const locationTable = Object({
	timestamp: Column('Timestamp', asString()),
	province: Column('จังหวัด', asString()),
	name: Column('ชื่อสถานที่', asString()),
	openingTime: Column('วันและเวลาที่เปิด', asString().optional()),
	phone: Column('เบอร์ติดต่อ', asString().optional()),
	address: Column('ที่อยู่', asString().optional()),
	mapUrl: Column('Google Map Link', asString().optional()),
});

export type Location = StaticDecode<typeof locationTable>;
