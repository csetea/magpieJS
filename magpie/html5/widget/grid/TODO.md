TODO list
=========

[ ] write API / guide / example for various layout scenarios


[ ] configurable grid spacing less / css
[o] nowrap property
[x] alignment inside item to bottom middle ...
	[x] item alignment: align="start|end|center|top|bottom|middle" ...
	[x] grid as base alignment: align="start|end|center|top|bottom|middle" ...
	[x] grid justify
			justify-content: flex-start | flex-end | center | space-between | space-around;
	[ ] rename align propety to m-align ??? to work genrally with magpie/ui/align?
[x] reverse property
[ ] use flex insted of width hieght settings in the future ??? 
[ ] offset - margin-left columns/grids-columns
	[ ] impl. it with margin-left / rigth ...
		1/24 style values and auto value
	[ ] auto
	[ ] it can be replace the justify property of m-grid ???
[x] reverse
[x] auto width
[x] orentation / direction: vertical
> [o] m-grid direction="vertical"
> [o] m-grid-item generate height percentage
> [ ] add config support for direction = horizontal / vertical
		and use it to generate css
[ ] http://css-tricks.com/snippets/css/a-guide-to-flexbox/
> [ ] item: order ?? is needed?
> [ ] grid // container
		flex-direction: row | row-reverse | column | column-reverse;
			row (default): left to right in ltr; right to left in rtl
			row-reverse: right to left in ltr; left to right in rtl
			column: same as row but top to bottom
			column-reverse: same as row-reverse but bottom to top
		flex-wrap: nowrap | wrap | wrap-reverse;
			nowrap (default): single-line / left to right in ltr; right to left in rtl
			wrap: multi-line / left to right in ltr; right to left in rtl
			wrap-reverse: multi-line / right to left in ltr; left to right in rtl
		flex-flow: <‘flex-direction’> || <‘flex-wrap’>
		justify-content: flex-start | flex-end | center | space-between | space-around;
			flex-start (default): items are packed toward the start line
			flex-end: items are packed toward to end line
			center: items are centered along the line
			space-between: items are evenly distributed in the line; first item is on the start line, last item on the end line
			space-around: items are evenly distributed in the line with equal space around them. Note that visually the spaces aren't equal, since all the items have equal space on both sides. The first item will have one unit of space against the container edge, but two units of space between the next item because that next item has it's own spacing that applies.
		align-items: flex-start | flex-end | center | baseline | stretch;
			flex-start: cross-start margin edge of the items is placed on the cross-start line
			flex-end: cross-end margin edge of the items is placed on the cross-end line
			center: items are centered in the cross-axis
			baseline: items are aligned such as their baselines align
			stretch (default): stretch to fill the container (still respect min-width/max-width)
		align-content: flex-start | flex-end | center | space-between | space-around | stretch;
		

> [ ] grid item // container
		order: <integer>;
		flex-grow: <number>; /* default 0 */
		flex-shrink: <number>; /* default 1 */
  		flex-basis: <length> | auto; /* default auto */
			This defines the default size of an element before the remaining space is distributed. The main-size value makes it match the width or height, depending on which is relevant based on the flex-direction.		
		flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
			This is the shorthand for flex-grow, flex-shrink and flex-basis combined. The second and third parameters (flex-shrink and flex-basis) are optional. Default is 0 1 auto.
		align-self: auto | flex-start | flex-end | center | baseline | stretch;
			This allows the default alignment (or the one specified by align-items) to be overridden for individual flex items.
				Please see the align-items explanation to understand the available values.		
		  	Note that float, clear and vertical-align have no effect on a flex item.
