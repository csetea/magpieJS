/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
/**
 * Example html markup<code>
		<m-select multiple placeholder='Select'>
			<!-- html based placeholder -->
			<div placeholder>
				Place <b>Holder</b> <i>2</i>
			</div>
			<!-- custom result provider, optional -->
			<div result> 
			Result :) !!!
			</div>

			<!--  -->
			<m-option>
				simple text
			</m-option>
			<m-option>
				html 1 <span>span</span>
			</m-option>
			<m-option>
				<div >html 2 div</div>
			</m-option>
			<m-option>
				<div ><b>html 2 b</b>div</div>
			</m-option>
		</m-select>
 * </code>
 * make example like http://purecss.io/grids/
 */
define([ 'magpie/html5/customElement!./m-select', //  
         'magpie/html5/customElement!./m-option'
         //
		],{} //
);
