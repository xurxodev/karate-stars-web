import { User } from "karate-stars-core";

export default interface AppState {
    currentUser?: User;
    isAuthenticated?: boolean;
}
