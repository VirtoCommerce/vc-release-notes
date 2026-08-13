/* Map-wide metadata. Bump `platformVersion` and `updated` when you do a sweep across the
   content files, and bump the per-atom `verifiedAgainst` for each atom you actually re-check. */
window.VC_MAP_META = {
  // The latest published release, not the dev version prefix: `compare/3.1058.0...dev` is one
  // commit changing one line of Directory.Build.props, so the code is identical and 3.1058.0 is
  // the version a reader can actually install.
  platformVersion: '3.1058.0',
  updated: '2026-08-13'
};
