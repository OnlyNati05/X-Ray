declare const __DEBUG_MODE__: boolean;

const DEBUG_MODE = __DEBUG_MODE__;

export function debug(message: string | undefined) {
  if (DEBUG_MODE) {
    $.writeln("[X-RAY] " + message);
  }
}
