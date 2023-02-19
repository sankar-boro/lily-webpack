export class BookSettingsHandler{
	props: any;

	constructor(props: any) {
		this.props = props;
	}

	view() {
		const { homeContext } = this.props;
		homeContext.dispatch({
			keys: ['modalCtx'],
			values: [{}]
		})
	}
}