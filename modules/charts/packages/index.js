import charts from "./charts";
import qc from "./qc";
import series from "./series";

const components = [charts, qc, series];

const install = (Vue) => {
	components.forEach((component) => {
		Vue.component(component.name, component);
	});
};

if (typeof window !== "undefined" && window.Vue) {
	install(window.Vue);
}

export default {
	install,
};
