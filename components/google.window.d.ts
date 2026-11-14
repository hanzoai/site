/* Google Identity Services, as the script at accounts.google.com/gsi/client puts it on window (components/OneTap.tsx). */
interface GoogleCredential {
  credential: string;
}

interface GoogleIdentity {
  initialize(config: {
    client_id: string;
    nonce: string;
    callback: (response: GoogleCredential) => void;
    auto_select: boolean;
    cancel_on_tap_outside: boolean;
    use_fedcm_for_prompt: boolean;
    itp_support: boolean;
    context: string;
  }): void;
  prompt(): void;
  cancel(): void;
}

interface Window {
  google?: { accounts?: { id?: GoogleIdentity } };
}
