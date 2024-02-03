import * as Yup from 'yup';
import Location from 'react-app-location';


const wholeNbr = Yup.number().integer().positive().required();

const HomeViewLocation = new Location('/boxo-frontend/home');
const AdminViewLocation = new Location('/boxo-frontend/admin');
const StoreViewLocation = new Location('/boxo-frontend/store');
const ProjectsViewLocation = new Location('/boxo-frontend/projects');
const ProjectsView404 = new Location('/boxo-frontend/404');
const WorkspaceViewLocation = new Location('/boxo-frontend/workspace/:workspace_id', { workspace_id: wholeNbr }, null);

const SignInViewLocation = new Location('/boxo-frontend/login');

export default {
    HomeView: HomeViewLocation,
    AdminView: AdminViewLocation,
    StoreView: StoreViewLocation,
    ProjectsView: ProjectsViewLocation,
    WorkspaceView: WorkspaceViewLocation,
    ProjectsView404: ProjectsView404,

    SignInView: SignInViewLocation,
};
