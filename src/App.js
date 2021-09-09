import { Route, Switch } from 'react-router-dom'
import routes from './routes'
import './App.less';

function App() {
    return (
        <div className="App">
            <section className="content">
                <Switch>
                    {routes.map((route, i) => (
                        <Route {...route} key={i} />
                    ))}
                </Switch>
            </section>
        </div>
    );
}

export default App;