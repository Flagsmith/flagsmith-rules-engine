import React, {Component} from 'react'
import rulesEngine from './bullet-train-rules-engine';
import Highlight from "./Highlight";
import { hot } from 'react-hot-loader'


const test = {
    favouriteColour: "blue",
    hasConfirmedEmail: true,
    name: 'kyle',
    money: 20,
    deepObject: {
        hiddenProperty: true
    }
};

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

class App extends Component {
    state = { isLoading: true };

    componentWillMount(props) {
        rulesEngine(test, rules)
            .then((res) => {
                this.setState({ rules, test, result: res.result, data: res, isLoading: false })
            });
    }

    render() {
        const { state: { isLoading, result, data, test, rules } } = this;
        return isLoading ? <div>Loading</div> : (
            <div>

                <div className="container-fluid">
                    <div className="row">
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <h3>Input:</h3>
                            <Highlight className={"json"}>
                                {JSON.stringify(test, null, 2)}
                            </Highlight>
                        </div>
                        <div className="col-md-4">
                            <h3>Rules</h3>
                            <Highlight className={"json"}>
                                {JSON.stringify(rules, null, 2)}
                            </Highlight>
                        </div>
                        <div className="col-md-4">
                            <h3>Output: {result ?
                                <span className="badge badge-success">True</span> :
                                <span className="badge badge-danger">False</span>
                            }</h3>
                            <Highlight className={"json"}>
                                {JSON.stringify(data, null, 2)}
                            </Highlight>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default hot(module)(App)
