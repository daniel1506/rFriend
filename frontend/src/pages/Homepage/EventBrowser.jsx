import React from 'react';
import ReactDOM from 'react-dom';
import './EventBrowser.css';

class EventBrowser extends React.Component {
    render() {
        return (
            <>
            <EventSearchBar/>
            <EventFilter/>
            </>
        );
    }
}

class EventSearchBar extends React.Component {
    render() {
        return (
            <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 .col-event-search-bar">
                        <div className="input-group event-search-bar shadow-sm">
                            <div className="input-group-prepend"><span className="input-group-text search-input-group-text"><i className="fa fa-search" aria-hidden="true"></i></span></div><input className="form-control search-input" style={{borderRadius: '0px 20px 20px 0px'}} type="text"/>
                            <div className="input-group-append"></div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

class EventFilter extends React.Component {
    render() {
        return (
            <div>
            <div className="container">
            <div className="row">
                <div className="col-md-6 col-xl-3 col-filter">
                    <div className="div-filter">
                        <h3>Event Filter</h3>
                        <div className="dropdown"><button className="btn btn-primary dropdown-toggle dropdown-filter" data-toggle="dropdown" aria-expanded="false" type="button">Event Catagory</button>
                            <div className="dropdown-menu" role="menu"><a className="dropdown-item" role="presentation" href="#">First Item</a><a className="dropdown-item" role="presentation" href="#">Second Item</a><a className="dropdown-item" role="presentation" href="#">Third Item</a></div>
                        </div>
                        <div className="dropdown"><button className="btn btn-primary dropdown-toggle dropdown-filter" data-toggle="dropdown" aria-expanded="false" type="button">Time</button>
                            <div className="dropdown-menu" role="menu"><a className="dropdown-item" role="presentation" href="#">Morning</a><a className="dropdown-item" role="presentation" href="#">Afternoon</a><a className="dropdown-item" role="presentation" href="#">Evening</a><a className="dropdown-item" role="presentation"
                                    href="#">Night</a></div>
                        </div>
                        <div className="dropdown"><button className="btn btn-primary dropdown-toggle dropdown-filter" data-toggle="dropdown" aria-expanded="false" type="button">Location</button>
                            <div className="dropdown-menu" role="menu"><a className="dropdown-item" role="presentation" href="#">Hong Kong Island</a><a className="dropdown-item" role="presentation" href="#">Kowloon</a><a className="dropdown-item" role="presentation" href="#">New Territory</a><a className="dropdown-item"
                                    role="presentation" href="#">Online</a></div>
                        </div>
                        <div className="dropdown"><button className="btn btn-primary dropdown-toggle dropdown-filter" data-toggle="dropdown" aria-expanded="false" type="button">Friend's Event</button>
                            <div className="dropdown-menu" role="menu"><a className="dropdown-item" role="presentation" href="#">Friends only</a><a className="dropdown-item" role="presentation" href="#">Friends of friends</a></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6"></div>
            </div>
            </div>
            </div>
        );
    }
}

ReactDOM.render(
    <EventBrowser/>,
    document.querySelector("#eventBrowser")
);
