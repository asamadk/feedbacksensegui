import {
    CONDITION_ANSWER_CONTAINS, CONDITION_ANY_VALUE, CONDITION_HAS_ANY_VALUE,
    CONDITION_IS, CONDITION_IS_EXACTLY, CONDITION_IS_NOT, CONDITION_QUESTION_IS_ANSWERED, DEFAULT_KEY, SMILEY_EXTREMELY_HAPPY, SMILEY_EXTREMELY_UNSATISFIED, SMILEY_HAPPY, SMILEY_NEUTRAL, SMILEY_UNSATISFIED
} from "./CoreConstants";

export class CoreUtils {

    static getInitialNode = (sortedNodes: any[]): any | null => {
        return sortedNodes.find(node => node.isStartingNode === true) || null;
    };

    static determineNextNode = (currentNode: any, answer: any): string | null => {
        const paths: any[] = currentNode.paths;
        const compId: number = currentNode?.data?.compId;
        if (paths != null && paths.length === 1 && paths[0].condition === DEFAULT_KEY) {
            return paths[0].uId;
        }
        for (let path of paths) {
            if (this.evaluateCondition(path.condition, path.value, this.extractCurrentAnswer(answer, compId), compId) === true) {
                return path.uId;
            }
        }
        return null;
    }

    static evaluateCondition(condition: any, expectedAnswer: string, answer: any, compId: number): boolean {
        if (compId === 6) {
            answer = this.getSmileyScaleNames(parseInt(answer));
        }
        if (compId === 8) {
            answer = parseInt(answer);
        }
        if (
            condition === CONDITION_HAS_ANY_VALUE ||
            condition === CONDITION_QUESTION_IS_ANSWERED ||
            condition === CONDITION_ANY_VALUE
        ) {
            if (answer != null && answer?.length > 0) { return true; }
        }

        if (condition === CONDITION_ANSWER_CONTAINS) {
            const tempAnswerArr = expectedAnswer.split(',');
            const tempAns: string = answer;
            for (const ans of tempAnswerArr) {
                if (tempAns.includes(ans)) { return true; }
            }
        }

        if (condition === CONDITION_IS) {
            if (answer === expectedAnswer) { return true; }
        }

        if (condition === CONDITION_IS_EXACTLY) {
            const answerArr: string[] = answer;
            if (answerArr != null && answerArr.length === 1 && answerArr[0] === expectedAnswer) {
                return true;
            }
        }

        if (condition === CONDITION_IS_NOT) {
            if (Array.isArray(answer) === true) {
                const answerArr: string[] = answer;
                if (answerArr.includes(expectedAnswer) === false) { return true; }
            } else {
                if (answer !== expectedAnswer) { return true; }
            }
        }

        if (condition === DEFAULT_KEY) { return true; }
        return false;
    }

    static extractCurrentAnswer(data: any, compId: number): any {
        if (compId === 5) {
            return data.answer;
        } else if (compId === 3 || compId === 4) {
            return data.selectedVal;
        } else if (compId === 6) {
            return data.emojiId;
        } else if (compId === 7 || compId === 8) {
            return data.value;
        } else if (compId === 11 || compId === 13) {
            return data;
        }
        return null;
    }

    static getSmileyScaleNames(smileyNum: number): string {
        console.log("🚀 ~ file: CoreUtils.ts:90 ~ CoreUtils ~ getSmileyScaleNames ~ smileyNum:", smileyNum)
        if (smileyNum === 0) {
            return SMILEY_EXTREMELY_UNSATISFIED
        } else if (smileyNum === 1) {
            return SMILEY_UNSATISFIED
        } else if (smileyNum === 2) {
            return SMILEY_NEUTRAL;
        } else if (smileyNum === 3) {
            return SMILEY_HAPPY;
        } else if (smileyNum === 4) {
            return SMILEY_EXTREMELY_HAPPY
        }
        return '';
    }
}