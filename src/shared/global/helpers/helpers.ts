// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Helpers {
	static firstLetterUppercase(str: string): string {
		const valueString = str.toLowerCase();
		return valueString
			.split(' ')
			.map(value => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
			.join(' ');
	}

	static lowercase(str: string): string {
		return str.toLowerCase();
	}

	static generateRandomIntegers(integerLength: number): number {
		const characters = '0123456789';
		let result = ' ';
		for (let i = 0; i < integerLength; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		return parseInt(result, 10);
	}

	static parseJson(prop: string): any {
		try {
			JSON.parse(prop);
		} catch (error) {
			return prop;
		}
	}
}
