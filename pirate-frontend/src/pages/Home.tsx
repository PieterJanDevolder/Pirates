import * as React from 'react';

export interface IHomeProps {
}

export interface IHomeState {
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div>
        <h1>hi world</h1>
        <button>Login Page</button>
      </div>
    );
  }
}
