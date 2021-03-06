0.3.3 -> 0.3.3-1

[*] magpie/html5/widget/select/m-select: selection list width fix
[*] magpie/crypt/base64: deprecated

0.3.2 -> 0.3.3

include document-register-element loader in builded versions instead of separated file
[*] magpie/html5/customElement/provider/WebReflection/document-register-element cdn update

0.3.1 -> 0.3.2

package.json for npm install build and dependency management

[*] CHANGE.log renamed -> CHANGELOG.md
[-] magpie/server removed and outsoruced into https://github.com/csetea/magpieJS-server repository
[*] r.js optimalization and build
[*] magpie/html5/widget/select/m-select:
		blur fixes,
		bugfix: do not reprocess child node if already initialized,
		IE fix: use CustomEvent instead of Event
		'change' event support
		m-appearance* attribute support
		fix: IE increase wait time before blur
		fix: IE click - add timeout to perform click events under the selection
[*] magpie/html5/widget/select/m-option:
		fix: find 'm-select' parent until body level
		fix findParent()

[*] magpie/resource/porperties: undefined/null check
[*] magpie/html5/router: fix: double listen on hashchange
[+] magpie/extend/knockout extensions bundle as package
[*][*] magpie/extend/knockout/drag: fix for IE and FireFox
[*] magpie/html5/customElement:
		fix for customElement reference in at 'attachedCallback' in child DOM in
[*] magpie/dom/inject fix: <template> supported, IE


0.3 -> 0.3.1

[*] magpie/html5/router
[*][*] bugfix: callback page.js next
[*][*] listen hash change
[+][+] visitHashQuery: ignoreHandlers parameter
[*][*] hashhQuery parameter bugfix
[+] magpie/extend/knockout/stopBinding
[+] magpie/extend/knockout/drag (dnd support)
[+] magpie/extend/knockout/drop (dnd support)
[+] magpie/html5/widget/select: enhanced select/dropdown box widget, tag name: 'm-select'
[-] magpie/dom/router (removed: cleanup)
[+] magpie/dom/grid Static (but configurable), CSS attributer selector based fast grid system.
	Note: magpie/html5/widget/grid Dynamic, HTML5 customElement + flex container based grid system.


0.2 -> 0.3

New modules:
[+] magpie/server/appServer
[+] mapgie/html5/router

Removed modules:
[-] magpie/view/viewProxy
[-] magpie/template -> magpie/resource/template -> removed
[-] magpie/view/router
[-] magpie/resourceLoader

Renamed modules:
[*] magpie/util/base64 -> magpie/crypt/base64
[*] magpie/idgenerator -> magpie/util/idgenerator
[*] magpie/view/customElement -> magpie/html5/customElement package (ie8+ support)
[*] magpie/view/grid -> magpie/html5/widget/grid
[*] magpie/view/m-source -> magpie/html5/widget/m-source
[*] magpie/view/m-view -> magpie/html5/widget/m-inject (+ added customElement casting mechanism)
[*] magpie/view/404 -> magpie/html5/widget/404 (converted to customElement)
[*] magpie/knockout-enterkey -> magpie/extend/knockout/enterkey
[*] magpie/resource -> magpie/resource/properties package (newly implemented as loader plugin)
[*] magpie/ui/page100 -> magpie/dom/page100
[*] magpie/ui/mediaQueries -> magpie/dom/mediaQueries
[*] magpie/ui/visibility -> magpie/dom/visibility
[*] magpie/ui/align -> magpie/dom/align
[*] magpie/ui/sticky -> magpie/dom/sticky
[*] magpie/log/log -> magpie/log/main

Notes:
[+] JSHint validation on sources to improve quality and detect potential problems
[*] mapgie/util/config: new support deep merge
[*] to update 'log' package: use 'magpie/log' path instead of 'log'
[*] to update 'log' package in configuration: rename 'log' to 'magpie/log/main'
