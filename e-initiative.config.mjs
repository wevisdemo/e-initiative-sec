/** @type {import('./src/models/config').EInitiativeConfig} */
export default {
	metadata: {
		title: 'Stop SEC ACT. And Land Bridge',
		description: 'หยุดกฎหมายพิเศษ เพื่อคนพิเศษ',
		siteUrl: 'https://stop-sec.com',
		previewImageUrl: 'https://stop-sec.com/og.png',
	},
	petition: {
		endDate: new Date('2025-08-31 GMT+7'),
		expectedSignatures: 50000,
		offline: {
			formUrl: 'petition-form.pdf',
			formExampleImageUrl: 'https://placehold.co/280x397?text=example',
			headquarter: {
				name: 'ชื่อสถานที่',
				address: 'ที่อยู่ บ้านเลขที่ จังหวัด ...',
				embedGoogleMapUrl:
					'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.298251120154!2d100.56221937605227!3d13.881106394284691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e28323d10290b5%3A0x946e22bc8754445a!2sOffice%20of%20Election%20Commission%20of%20Thailand!5e0!3m2!1sen!2sth!4v1716288187164!5m2!1sen!2sth',
			},
			volunteer: {
				registrationFormUrl: '#volunteer-register',
				assetsUrl: '#asset',
				contact: {
					name: 'ชื่อช่องทาง',
					url: '#contact',
				},
			},
		},
	},
	theme: {
		colors: {
			primary: '#51F4CD',
			'primary-focus': '#3ADBB4',
			secondary: '#F6E47F',
			'secondary-focus': '#E0CD62',
			accent: '#8054FF',
			'accent-focus': '#5929E3',
			neutral: '#000000',
			'base-100': '#FFFFFF',
			'base-300': '#E5E6E6',
			info: '#F8EB54',
			red: '#FF0000',
			'red-focus': '#E62D05',
			gray: '#000000',
		},
		fonts: {
			body: 'IBM Plex Sans Thai Looped',
			'heading-fixed': 'IBM Plex Sans Thai',
			'heading-responsive': 'IBM Plex Sans Thai Looped',
			link: 'IBM Plex Sans Thai Looped',
		},
		stylesheets: [
			'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai+Looped:wght@100;200;300;400;500;600;700&display=swap',
		],
	},
	sheets: {
		id: '1lV3AnEUM1bmTfOFbSn5ukvT2r3XmFrilOS4ewhJtc0Y',
		enableOfflineSignature: false,
		enableLocations: true,
	},
	renderer: {
		templateFile: './public/petition-form.pdf',
		fontFile: './src/fonts/Sarabun-Regular.ttf',
		fontSize: 10,
		lineHeight: 14,
		fields: [
			{ key: 'location', type: 'text', x: 375, y: 665, maxWidth: 160 },
			{ key: 'day', type: 'text', x: 317, y: 644 },
			{ key: 'month', type: 'text', x: 376, y: 644, maxWidth: 83 },
			{ key: 'year', type: 'text', x: 496, y: 644 },
			{ key: 'fullname', type: 'text', x: 229, y: 589, maxWidth: 290 },
			{
				key: 'citizenId',
				type: 'text',
				x: 223,
				y: 537,
				fontSize: 22,
				lineHeight: 30,
				split: {
					by: '',
					getOffsetX: (_, i) =>
						i * 22 /* digit width */ +
						[0, 4, 9, 11].filter((d) => d < i).length * 6.5 /* dash width */,
				},
			},
			{
				key: 'signature',
				type: 'image',
				x: 325,
				y: 370,
				maxWidth: 100,
				maxHeight: 50,
			},
			{ key: 'fullname', type: 'text', x: 318, y: 365, maxWidth: 120 },
		],
	},
};
