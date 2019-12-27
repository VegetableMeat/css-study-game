class Form {
	constructor(n) {
		this.n = n;
	}

	getAnswer() {
		switch(this.n) {
			case 0:
				return ['答え', 0];
				break;
			case 1:
				return ['答え', 1]
				break;
			case 2:
				return ['答え', 2]
				break;
			default:
				break;
		}
	}
}