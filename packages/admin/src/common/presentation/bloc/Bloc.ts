type Subscription<S> = (state: S) => void;

abstract class Bloc<S> {

    private state: S;
    private listener?: Subscription<S>;

    constructor(initalState: S) {
        this.state = initalState;
    }

    public get getState(): S {
        return this.state;
    }

    changeState(state: S) {
        this.state = state;

        if (this.listener) {
            this.listener(this.state);
        }
    }

    subscribe(listener: Subscription<S>) {
        this.listener = listener;
    }

    protected dispose() {
        //Override on derivated  vaclass dispose if 
        //you need clear subscriptions for example
    }
}

export default Bloc;