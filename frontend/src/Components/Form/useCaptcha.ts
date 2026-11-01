import { create } from 'zustand';
import providerAction from 'Utilities/providerAction';

interface CaptchaRequest {
  siteKey?: string;
  secretToken?: string;
  ray?: string;
  stoken?: string;
  responseUrl?: string;
}

interface CaptchaState extends CaptchaRequest {
  refreshing: boolean;
  token: string | null;
}

const defaultState: CaptchaState = {
  refreshing: false,
  token: null,
  siteKey: undefined,
  secretToken: undefined,
  ray: undefined,
  stoken: undefined,
  responseUrl: undefined,
};

// What the captcha of the input that is shown asks for, it is forgotten when
// the input is shown again
export const useCaptchaStore = create<CaptchaState>()(() => defaultState);

const { setState, getState } = useCaptchaStore;

interface CaptchaPayload {
  provider: string;
  providerData: Record<string, unknown>;
}

export function resetCaptcha() {
  setState(defaultState);
}

// Asks the provider for a captcha to solve
export function refreshCaptcha({ provider, providerData }: CaptchaPayload) {
  setState({ refreshing: true });

  return providerAction<{ captchaRequest?: CaptchaRequest }>({
    provider,
    action: 'checkCaptcha',
    providerData,
  }).then(
    (data) => setState({ refreshing: false, ...data.captchaRequest }),
    () => setState({ refreshing: false })
  );
}

// Exchanges the solved captcha for the token of the provider
export function getCaptchaCookie({
  provider,
  providerData,
  captchaResponse,
}: CaptchaPayload & { captchaResponse: string }) {
  const { responseUrl, ray } = getState();

  return providerAction<{ captchaToken: string }>({
    provider,
    action: 'getCaptchaCookie',
    providerData,
    queryParams: { responseUrl, ray, captchaResponse },
  }).then((data) => setState({ token: data.captchaToken }));
}
