export class AuthEvent {
    callback: (event: CustomAuthEvent) => void;
    constructor() {
        this.callback = () => {};
    }

    subscribe(callback: (event: CustomAuthEvent) => void) {
        this.callback = callback;
        document.addEventListener("authChange", (event) => {
            callback(event as CustomAuthEvent);
        });
    }

    unsubscribe() {
        document.removeEventListener(
            "authChange",
            this.callback as EventListener
        );
    }

    trigger(authenticated: boolean = false) {
        const AuthChange: CustomAuthEvent = new CustomEvent("authChange", {
            detail: {
                authenticated: authenticated,
            },
        });
        document.dispatchEvent(AuthChange);
    }
}

export default AuthEvent;
