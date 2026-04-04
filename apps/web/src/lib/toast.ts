import { gooeyToast } from "gooey-toast";

export const toast = {
	success: (message: string) => gooeyToast.success({ title: message }),
	error: (message: string) => gooeyToast.error({ title: message }),
	info: (message: string) => gooeyToast.info({ title: message }),
	warning: (message: string) => gooeyToast.warning({ title: message }),
};
