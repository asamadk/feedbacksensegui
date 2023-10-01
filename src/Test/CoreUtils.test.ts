import { CONDITION_ANSWER_CONTAINS, CONDITION_HAS_ANY_VALUE, CONDITION_IS, CONDITION_IS_EXACTLY, CONDITION_IS_NOT, CONDITION_QUESTION_IS_ANSWERED, DEFAULT_KEY, SMILEY_EXTREMELY_UNSATISFIED, SMILEY_HAPPY } from "../SurveyEngine/CoreUtils/CoreConstants";
import { CoreUtils } from "../SurveyEngine/CoreUtils/CoreUtils";

describe('CoreUtils', () => {
    it('should return the initial node', () => {
        const nodes = [{ isStartingNode: false }, { isStartingNode: true }];
        expect(CoreUtils.getInitialNode(nodes)).toEqual({ isStartingNode: true });
    });

    it('should return null if there is no initial node', () => {
        const nodes = [{ isStartingNode: false }, { isStartingNode: false }];
        expect(CoreUtils.getInitialNode(nodes)).toBeNull();
    });
});

it('should return the correct next node based on a given condition', () => {
    const currentNode = {
        paths: [{
            condition: CONDITION_HAS_ANY_VALUE,
            value: 'someValue',
            uId: '123'
        }],
        data: { compId: 3 }
    };
    const answer = { selectedVal: 'someValue' };
    expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('123');
});

it('should evaluate a given condition correctly', () => {
    const condition = CONDITION_HAS_ANY_VALUE;
    const expectedAnswer = 'someValue';
    const answer = 'someValue';
    const compId = 3; 
    expect(CoreUtils.evaluateCondition(condition, expectedAnswer, answer, compId)).toBe(true);
});

it('should extract the current answer based on compId', () => {
    const data = { selectedVal: 'someValue' };
    const compId = 3;
    expect(CoreUtils.extractCurrentAnswer(data, compId)).toBe('someValue');
});

it('should return the correct smiley name based on a given smileyNum', () => {
    expect(CoreUtils.getSmileyScaleNames(0)).toBe(SMILEY_EXTREMELY_UNSATISFIED);
});

describe('CoreUtils -> determineNextNode', () => {

    // Test 1: Paths are null
    it('should return null if paths are null', () => {
        const currentNode = { paths: null, data: { compId: 3 } };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBeNull();
    });

    // Test 2: Paths are empty
    it('should return null if paths are empty', () => {
        const currentNode = { paths: [], data: { compId: 3 } };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBeNull();
    });

    // Test 3: Only one default path exists
    it('should return the uId of the default path if only one path exists', () => {
        const currentNode = { 
            paths: [{ condition: DEFAULT_KEY, uId: '123' }], 
            data: { compId: 3 } 
        };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('123');
    });

    // Test 4: Multiple paths but one matches
    it('should return the correct uId when only one condition matches', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS, value: 'wrongValue', uId: '123' },
                { condition: CONDITION_IS, value: 'someValue', uId: '456' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('456');
    });

    // Test 5: No paths match
    it('should return null if no conditions match', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS, value: 'wrongValue', uId: '123' },
                { condition: CONDITION_IS, value: 'anotherWrongValue', uId: '456' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBeNull();
    });

    // Test 6: Special conditions based on compId
    it('should evaluate correctly for a given compId special condition', () => {
        const currentNode = {
            paths: [{ condition: CONDITION_IS, value: SMILEY_HAPPY, uId: '123' }],
            data: { compId: 6 }
        };
        const answer = { emojiId: 3 };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('123');
    });

    // Test 7: CONDITION_ANSWER_CONTAINS (positive scenario)
    it('should return the correct uId for CONDITION_ANSWER_CONTAINS', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_ANSWER_CONTAINS, value: 'partValue', uId: '789' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'somepartValuehere' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('789');
    });

    // Test 8: CONDITION_ANSWER_CONTAINS (negative scenario)
    it('should return null if answer does not contain the expected part', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_ANSWER_CONTAINS, value: 'absentValue', uId: '789' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'somepartValuehere' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBeNull();
    });

    // Test 9: CONDITION_IS_EXACTLY (positive scenario)
    it('should return the correct uId for CONDITION_IS_EXACTLY with a matching single-value array', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS_EXACTLY, value: 'exactValue', uId: '910' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: ['exactValue'] };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('910');
    });

    // Test 10: CONDITION_IS_EXACTLY (negative scenario - multiple values in array)
    it('should return null for CONDITION_IS_EXACTLY with a multiple-value array', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS_EXACTLY, value: 'someValue', uId: '910' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: ['someValue', 'anotherValue'] };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBeNull();
    });

    // Test 11: CONDITION_IS_NOT (positive scenario with array answer)
    it('should return the correct uId for CONDITION_IS_NOT when the value is not in the array', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS_NOT, value: 'absentValue', uId: '1112' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: ['someValue', 'anotherValue'] };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('1112');
    });

    // Test 12: CONDITION_IS_NOT (negative scenario with single answer)
    it('should return null for CONDITION_IS_NOT when the single answer matches the expected value', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS_NOT, value: 'someValue', uId: '1112' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBeNull();
    });

    // Test 13: CONDITION_QUESTION_IS_ANSWERED (positive scenario)
    it('should return the correct uId for CONDITION_QUESTION_IS_ANSWERED when answer has a value', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_QUESTION_IS_ANSWERED, uId: '1314' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('1314');
    });

    // Test 14: CONDITION_QUESTION_IS_ANSWERED (negative scenario - no answer)
    it('should return null for CONDITION_QUESTION_IS_ANSWERED when there is no answer', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_QUESTION_IS_ANSWERED, uId: '1314' }
            ],
            data: { compId: 3 }
        };
        const answer = {};
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBeNull();
    });

    it('should return the uId of the first satisfied path when multiple paths meet the criteria', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS, value: 'someValue', uId: '1516' },
                { condition: CONDITION_IS, value: 'someValue', uId: '1718' },
                { condition: CONDITION_IS, value: 'someValue', uId: '1920' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('1516');  // Should return the uId of the first path that satisfies the condition.
    });

    // Test 16: Only second path satisfies condition
    it('should return the uId of the second path if only the second path satisfies the condition', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS, value: 'differentValue', uId: '2122' },
                { condition: CONDITION_IS, value: 'someValue', uId: '2324' },
                { condition: CONDITION_IS, value: 'anotherDifferentValue', uId: '2526' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('2324');  // Should return the uId of the second path as it's the first one that satisfies the condition.
    });

    // Test 17: Mixed conditions, only second path satisfies condition
    it('should return the uId of the second path if mixed conditions are present and only the second one is met', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS_NOT, value: 'someValue', uId: '2728' },
                { condition: CONDITION_IS, value: 'someValue', uId: '2930' },
                { condition: CONDITION_ANSWER_CONTAINS, value: 'unmatchedValue', uId: '3132' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'someValue' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('2930');
    });

    // Test 18: Path with CONDITION_ANSWER_CONTAINS is satisfied
    it('should return the uId of a path when CONDITION_ANSWER_CONTAINS is met', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_ANSWER_CONTAINS, value: 'apple,banana', uId: '3334' },
                { condition: CONDITION_IS, value: 'orange', uId: '3536' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'apple' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('3334');
    });

    // Test 19: No path is satisfied
    it('should return null if no path condition is met', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS, value: 'apple', uId: '3738' },
                { condition: CONDITION_IS_NOT, value: 'banana', uId: '3940' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'banana' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe(null);
    });

    // Test 20: CONDITION_IS_EXACTLY is satisfied
    it('should return the uId of a path when CONDITION_IS_EXACTLY is met with single exact answer', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS_EXACTLY, value: 'apple', uId: '4142' },
                { condition: CONDITION_IS, value: 'banana', uId: '4344' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'apple' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('4142');
    });

    // Test 21: First path with CONDITION_IS_NOT is satisfied before CONDITION_IS
    it('should return the uId of the first path if the first path with CONDITION_IS_NOT is satisfied before CONDITION_IS', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS_NOT, value: 'apple', uId: '4546' },
                { condition: CONDITION_IS, value: 'banana', uId: '4748' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: 'banana' };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('4748');
    });

    // Test 22: Handling array answers, CONDITION_IS_NOT should return true when no item in array matches
    it('should return the uId when answer is an array and CONDITION_IS_NOT is satisfied', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS_NOT, value: 'apple', uId: '4950' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: ['banana', 'grape'] };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('4950');
    });

    // Test 23: Handling array answers, CONDITION_IS should return true when any item in array matches
    it('should return the uId when answer is an array and CONDITION_IS is satisfied', () => {
        const currentNode = {
            paths: [
                { condition: CONDITION_IS, value: 'apple', uId: '5152' }
            ],
            data: { compId: 3 }
        };
        const answer = { selectedVal: ['apple', 'banana'] };
        expect(CoreUtils.determineNextNode(currentNode, answer)).toBe('5152');
    });

});



export {};
