// libs
import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { push } from "react-router-redux";

// local
import LocalDemo from "./components/LocalDemo";
import getSessionStorage from "../../shared/sessionStorage";
import Skeleton from '../../components/Skeleton/Skeleton';

class DemoTool extends React.Component {
	constructor() {
		super();

		this.state = {};
	}

	componentWillMount() {
		if (global.window) {
			const sessionStorage = getSessionStorage();
			const { firstRequest } = sessionStorage;
			if (!firstRequest) {
				sessionStorage.firstRequest = moment().toString();
			}
		}
	}

	render() {
		const { country, language } = this.props;

		if (!country || !country.fields.home) {
			return null;
		}

		return (
			<Skeleton>
				<div className="SkeletonContainer">
					<LocalDemo country={country} language={language}></LocalDemo>
				</div>
			</Skeleton>
		);
	}
}

const mapState = ({ country, language }, p) => ({ language, country });

const mapDispatch = (d, p) => ({ onNavigate: path => (d(push(path))) });

export default connect(mapState, mapDispatch)(DemoTool);
