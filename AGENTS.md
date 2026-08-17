# X-Ray

X-Ray is an Adobe After Effects CEP extension built
with Bolt CEP, React, TypeScript, and Vite.

## Architecture

- Frontend/CEP code: `src/js`
- After Effects ExtendScript: `src/jsx/aeft`
- ExtendScript entry point: `src/jsx/index.ts`
- Use Bolt's `evalTS()` to call ExtendScript from CEP.
- `cep.config.ts` defines the CEP configuration.
- Bolt generates the CSXS manifest; do not manually create one.
- `npm run dev` runs the HMR development environment.
- `npm run build` creates the static extension in `dist/cep`.

## Bolt documentation

Full Bolt CEP documentation is available at:
`docs/bolt-cep.md`

Read it before changing Bolt configuration, build behavior,
ExtendScript architecture, CEP communication, packaging,
or anything where the conventions above are insufficient.
