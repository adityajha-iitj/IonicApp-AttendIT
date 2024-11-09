import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Login';
import AdminRegister from './pages/AdminRegister';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import CaptureQR from './pages/CaptureQR';
import Register from './pages/Register';
import signup from './pages/signup';
import CaptureYourself from './pages/CaptureYourself';
import AdminDashboard from './pages/AdminDashboard';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Login />
        </Route>
        <Route component={CaptureQR} path="/capture" exact/>
        <Route component={Register} path="/register" exact/>
        <Route component={signup} path= "/signup" exact />
        <Route component={CaptureYourself} path="/captureYourself" exact/>
        <Route component={AdminDashboard} path="/admin" exact/>
        <Route component={AdminRegister} path="/adminRegister" exact/>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
