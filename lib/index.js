import getProp from './getProp';
import getProp from './getProp';

const log = function (res) {
    if (true) {
        console.log(res);
    }
};
const operators = {
    "EQUAL": "EQUAL",
    "NOT_EQUAL": "NOT_EQUAL",
    "GREATER_THAN": "GREATER_THAN",
    "GREATER_THAN_INCLUSIVE": "GREATER_THAN_INCLUSIVE",
    "LESS_THAN": "LESS_THAN",
    "LESS_THAN_INCLUSIVE": "LESS_THAN_INCLUSIVE",
    "CONTAINS": "CONTAINS",
    "NOT_CONTAINS": "NOT_CONTAINS",
    "REGEX": "REGEX",
};
//
// const rules = {
//     all: [{
//         all: [{
//             rule: 'favouriteColour',
//             operator: 'equal',
//             value: "blue"
//         }]
//     }, {
//         all: [{
//             rule: 'money',
//             operator: 'equal',
//             value: 10
//         }, {
//             rule: 'age',
//             operator: 'greaterThanInclusive',
//             value: 21
//         }]
//     }]
// };
const testValue = (value, { operator, value: ruleValue }) => {
    log("Testing value", value, operator, ruleValue)
    switch (operator) {
        case "EQUAL":
            return value === ruleValue;
        case "NOT_EQUAL":
            return value !== ruleValue;
        case "GREATER_THAN":
            return value > ruleValue;
        case "GREATER_THAN_INCLUSIVE":
            return value >= ruleValue;
        case "LESS_THAN":
            return value < ruleValue;
        case "LESS_THAN_INCLUSIVE":
            return value <= ruleValue;
        case "CONTAINS":
            return value && (value + "").contains(ruleValue);
        case "NOT_CONTAINS":
            return !value || !((value + "").contains(ruleValue));
        case "REGEX":
            value && new RegExp(ruleValue).test(ruleValue)
    }
}

const processRule = (object, rule, breadcrumb) => {
    log('Processing', breadcrumb);
    return new Promise((resolve, reject) => {
        const key = breadcrumb[breadcrumb.length - 1];
        const value = _.get(rule, breadcrumb);
        if (key === 'all' || key === 'any') { // get recursive the results
            return Promise.all(
                value.rules.map((_, key) => {
                    return processRule(object, rule, breadcrumb.concat([key,'rules']))
                }
            )).then((results)=>{
                let res;
                if (key === 'all') {
                    res = !results.contains(false)
                } else {
                    res = results.contains(true);
                }
                value.result = res; // store the result against the rule
                return resolve(res);
            })
        } else{ // The rule is a simple rule, check
            const res = testValue(getProp(object,key), value);
            value.result = res; // store the result against the rule
            return resolve(res);
        }
    })
};




const rules = {
    all: {
        rules: [{
            all: {
                rules: [{
                    rule: 'favouriteColour',
                    operator: 'equal',
                    value: "blue"
                }]
            }
        }, {
            all: {
                rules: [{
                    rule: 'money',
                    operator: 'equal',
                    value: 10
                }, {
                    rule: 'age',
                    operator: 'greaterThanInclusive',
                    value: 21
                }]
            }
        }]
    }
};

processRule()
.then((res)=>{
    console.log("The result", res.result);
});
