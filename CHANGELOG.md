# Commander - FoundryVTT at your fingertips

## v1.0.0 (2022-09-02)
- Added welcome message, and improved `i(nfo)` and `help` commands.
- Manifest migration for v10
- Full suggestions with up/down arrow keys
- Renamed Application class from Widget -> Commander to make the foundry rendering console log less generic-looking (No more "Foundry VTT | Rendering Widget" without any clear finger pointing at Commander)
- Fixed 'Open Compendium (comp)' command to not create a new Compendium instance and use the exiting app con the compendium (This caused that the open windows would not reflect changes on the underlying compendium even when they were happening in the background).


## v0.1.0 (2022-02-19)
- Initial Release
- Complete functionality, but pending some improvements before calling it v1.0.0