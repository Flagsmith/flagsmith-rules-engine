import getProp from './getProp';

const log = function (res) {
    if (false) {
        console.log(res);
    }
};

const operators = {
    'EQUAL': 'EQUAL',
    'NOT_EQUAL': 'NOT_EQUAL',
    'GREATER_THAN': 'GREATER_THAN',
    'GREATER_THAN_INCLUSIVE': 'GREATER_THAN_INCLUSIVE',
    'LESS_THAN': 'LESS_THAN',
    'LESS_THAN_INCLUSIVE': 'LESS_THAN_INCLUSIVE',
    'CONTAINS': 'CONTAINS',
    'NOT_CONTAINS': 'NOT_CONTAINS',
    'REGEX': 'REGEX',
};

const testValue = (object, { property, operator, value: ruleValue }) => {
    log('Testing value', value, operator, ruleValue)
    const value = getProp(object, property);
    switch (operator) {
        case operators.EQUAL:
            return value === ruleValue;
        case operators.NOT_EQUAL:
            return value !== ruleValue;
        case operators.GREATER_THAN:
            return value > ruleValue;
        case operators.GREATER_THAN_INCLUSIVE:
            return value >= ruleValue;
        case operators.LESS_THAN:
            return value < ruleValue;
        case operators.LESS_THAN_INCLUSIVE:
            return value <= ruleValue;
        case operators.CONTAINS:
            return value && (value + '').includes(ruleValue);
        case operators.NOT_CONTAINS:
            return !value || !((value + '').includes(ruleValue));
        case operators.REGEX:
            return value && new RegExp(ruleValue).test(value);
        default:
            console.error('Invalid operator',)
            return false;
    }
};

const processRule = (object, rule, breadcrumb) => {
    log('Processing', breadcrumb);
    return new Promise((resolve, reject) => {
        const key = breadcrumb[breadcrumb.length - 1];
        const value = getProp(rule, breadcrumb);
        if (key === 'all' || key === 'any' || key === 'none') { // get recursive the results
            return Promise.all(
                value.rules.map((_, key) => {
                        let newKey = ['rules', key];
                        if (_.any) { //only process rules
                            newKey = newKey.concat(['any'])
                        } else if (_.all) {
                            newKey = newKey.concat(['all'])
                        } else if (_.none) {
                            newKey = newKey.concat(['none'])
                        }
                        return processRule(object, rule, breadcrumb.concat(newKey))
                    }
                )).then((results) => {
                let res;
                if (key === 'all') {
                    res = !results.includes(false)
                } else if (key === 'any') {
                    res = results.includes(true);
                } else if (key === 'none') {
                    res = !results.includes(true)
                }
                value.result = !!res; // store the result against the rule
                if (breadcrumb.length === 1) {
                    resolve(rule); // processing finished, resolve with full object
                }
                return resolve(res);
            })
        } else { // The rule is a simple rule, check
            const res = !!testValue(object, value);
            value.result = res; // store the result against the rule
            return resolve(res);
        }
    })
};

export default function (object, rules) {
    return processRule(object, { all: {rules} }, ['all'])
        .then((res)=>{
            return {
                result: res.all.result,
                rules: res.all.rules
            }
        })
};
