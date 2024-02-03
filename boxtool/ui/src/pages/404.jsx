import React, {Component, Fragment} from 'react'

class View404 extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Fragment>
                <div className="ui grid middle aligned segment inverted"
                     style={{height: '100%', background: '#6ebe45', margin: '0'}}>
                    <div className="ui column center aligned">
                        <div className="ui inverted statistic">
                            <div className="value">404</div>
                            <div className="label">Erreur</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default (View404)