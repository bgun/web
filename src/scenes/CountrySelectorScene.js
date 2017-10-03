import React from "react";
import services from "../backend";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { CountrySelector } from "../components";
import { actions } from "../store";
import { Redirect } from "react-router";
import { history } from "../store";
import cms from "../content/cms";

class CountrySelectorScene extends React.Component {
	componentWillMount() {
		const { onMountOrUpdate } = this.props;
		onMountOrUpdate();
	}

	render() {
		const { country, language } = this.props;
		const { countryList, onGoTo } = this.props;
		const { firstRequest } = global.window.localStorage;
		const firstTimeHere = !firstRequest;

		if (!countryList) {
			return <div />;
        }
        
		if (countryList.length === 1) {
			onGoTo(countryList[0].slug);

			return <div />;
		}

		if (firstTimeHere || !country) {
			return (
				<CountrySelector onGoTo={onGoTo} countryList={countryList} />
			);
		} else {
			if (!language) {
				return <Redirect to={`/language-selector`} />;
			} else {
				return <Redirect to={`/${country.slug}`} />;
			}
		}

		return (
			<div>
				{countryList.map((c, i) => (
					<div
						key={c.id}
						onClick={() => {
							onGoTo(c.slug);
						}}
					>
						{c.name}
					</div>
				))}
			</div>
		);
	}
}

const mapState = ({ countryList, country, language }, p) => {
	return {
		countryList,
		country,
		language,
	};
};
const mapDispatch = (d, p) => {
	return {
		onMountOrUpdate: () => {
			cms.client
				.getEntries({ content_type: "country" })
				.then(e => e.items.map(a => ({ id: a.sys.id, ...a.fields })))
				.then(e => {
					console.log(e);
					d(actions.selectCountryList(e));
				});
		},
		onGoTo: slug => {
			d(push(`/${slug}`));
		},
	};
};

export default connect(mapState, mapDispatch)(CountrySelectorScene);