import { colorPalette } from "./Constants";
import { getLineChartColor } from "./FeedbackUtils";

export const overAllCustomerHealthColors = [colorPalette.primary, colorPalette.fsGray, colorPalette.darkBackground];

export const renewedColors = [colorPalette.fsGray, colorPalette.primary];

export const npsColors = [colorPalette.darkBackground, colorPalette.primary]

export function getCstmrJrnyStgScoreColor() {
    const res: string[] = [];
    for (let i = 0; i < 10; i++) {
        res.push(getLineChartColor(i));
    }
    return res;
}