<img width="100%" src="https://raw.githubusercontent.com/SolidStateGroup/bullet-train-frontend/master/hero.png"/>

# bullet-train-rules-engine
This project is the JavaScript rules engine that powers user segments for bullet-train.io.

<img src="https://i.ibb.co/G5FZyjC/Screenshot-at-Apr-14-13-07-52.png">

## Features

It allows for a recursive ruleset, with ```ANY```  ```ALL``` and ```NONE``` predicates.
It supports the following types of operations:

- "EQUAL": "EQUAL",
- "NOT_EQUAL": "NOT_EQUAL",
- "GREATER_THAN": "GREATER_THAN",
- "GREATER_THAN_INCLUSIVE": "GREATER_THAN_INCLUSIVE",
- "LESS_THAN": "LESS_THAN",
- "CONTAINS": "CONTAINS",
- "NOT_CONTAINS": "NOT_CONTAINS",
- "REGEX": "REGEX",

## Installation

```
npm i bullet-train-rules-engine --save
``` 


## Usage
```
import rulesEngine from 'bullet-train-rules-engine'

// The object to test
const test = {
    favouriteColour: "blue",
    hasConfirmedEmail: true,
    name: 'kyle',
    deepObject: {
        hiddenProperty: true
    }
};

// The ruleset
const rules = [
    {
        property: 'favouriteColour',
        operator: 'EQUAL',
        value: "blue"
    },
    {
        any: {
            rules: [
                {
                    property: 'money',
                    operator: 'GREATER_THAN_INCLUSIVE',
                    value: 11
                },
                {
                    property: 'hasConfirmedEmail',
                    operator: 'EQUAL',
                    value: true
                },
                {
                    property: 'deepObject.hiddenProperty',
                    operator: 'EQUAL',
                    value: true
                },
                {
                    property: 'favouriteColour',
                    operator: 'NOT_CONTAINS',
                    value: "blue"
                },
                {
                    none: {
                        rules: [
                            {
                                property: 'favouriteColour',
                                operator: 'EQUALS',
                                value: "green"
                            },
                            {
                                property: 'money',
                                operator: 'EQUALS',
                                value: 99
                            },
                        ]
                    }
                }
            ]
        },
    },
    {
        all: {
            rules: [
                {
                    property: 'name',
                    operator: 'REGEX',
                    value: "ky.*?e"
                },
            ]
        }
    }
];

   rulesEngine(test, rules)
            .then(({result, rules}) => {
              // use the overall result and see a breakdown of which rules comply
            });

``` 

## Run the example at localhost:3000
Clone the repository and run:

```
npm i
npm start
```


## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/kyle-ssg/c36a03aebe492e45cbd3eefb21cb0486) for details on our code of conduct, and the process for submitting pull requests to us.

## Getting Help

If you encounter a bug or feature request we would like to hear about it. Before you submit an issue please search existing issues in order to prevent duplicates. 

## Get in touch

If you have any questions about our projects you can email <a href="mailto:projects@solidstategroup.com">projects@solidstategroup.com</a>.


