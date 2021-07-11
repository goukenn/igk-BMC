<?php
//--------------------------------------------------------------------------------------------------------------
//BMC - module
//desc: all Balafon's html node item function declaration 
//--------------------------------------------------------------------------------------------------------------

use IGK\Resources\R;

igk_reg_component_package("BMC" , function($name){
	$fn = 'igk_html_node_BMC'.$name;
	if (function_exists($fn)){
		return call_user_func_array($fn, array_slice(func_get_args(),1));
	} 
	return null;
});

function igk_html_node_BMCTextfield($id, $type="text" ){
	//inspiration in google material
	// <div class="mdc-text-field mdc-text-field--box password">
	// <label class="mdc-floating-label" for="pwd">password</label>
	// <input type="password" class="mdc-text-field__input" id="login" name="pwd" required />
	// <div class="mdc-line-ripple"></div>
	// </div>
	// if (is_array($id)){
		// igk_wln_e(igk_html_extract_id($id));
	// }
	
	extract(igk_html_extract_id($id));
	if (!isset($attribs)){
		$attribs = [];
	}
	$maxsize  = null;
	$class = null;
	$v = null;
	$required = 0;
	$autocompleteoff=1;
	$lineripple = 0;
	$text=null;
	if(is_array($type)){
		$v = igk_getv($type, "v") ?? $v;
		$text = igk_getv($type, "text") ?? $text;
		$required = igk_getv($type, "require") ?? $required;
		$maxsize = igk_getv($type, "maxsize");
		$lineripple = igk_getv($type, "lineripple");
		
		
		if (isset($type["class"])){
			$class = " ".igk_getv($type, "class");
		}
		
		if ($cad = igk_getv($type, "attribs")){
			$attribs = array_merge($attribs, $cad); 
			unset($cad); 			
		}
		$type = igk_getv($type, "type") ?? "text";
	}

	
	$n = igk_createNode("div");
	$n["class"]="igk-winui-bmc-textfield ".$type.$class;
	$i = $n->addInput($id, $type, $v ?? igk_get_form_args($id))
	->setAttributes(array_merge([
		"class"=>"igk-winui-bmc-field__input"
	], $attribs));
	if ($maxsize){
		$i->setAttribute("maxlength", $maxsize);
	}
	if ($autocompleteoff){
		$i["autocomplete"] = $type=="password"? "current-password" : "off";
	}
	if ($required){
		$n["class"] = "+igk-require";		
	}
	if (isset($tip)){
		igk_wln_e($tip);
		$i["placeholder"] = $tip;
	}
	
	$n->add("label")->setAttributes(
		["class"=>"igk-winui-bmc-floating-label", "for"=>$id]
	)->Content= isset($tip)? $tip :  ($text ? $text : R::gets("lb.".$id));
	
	if ($lineripple)
	$n->addDiv()->setClass("igk-winui-bmc-line-ripple");	
	
	return $n;
}

// text-search-file
function igk_html_node_BMCTextSearchfield($id, $value=null, $uri=null, $target=null){
	
	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-textsearchfield";
	$n["igk:ref"]=$uri;
	$n["igk:target"]=$target;

	$n->addInput($id, "text", $value)->setAttributes([
		"class"=>"igk-winui-bmc-field__input"
	]);
	$noTag = $n->addNoTagNode();
	$noTag->setIndex(1000);	
	$noTag->add("label")
	->setAttributes(["for"=>$id])
	->setClass("logo igk-winui-bmc-focus-label")->Content = igk_svg_use("search");
	$noTag->addBMCLineRipple();
	return $n;
}

function igk_html_node_BMCTextLogofield($id, $logo){
	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-textloagofield";
	$n->addInput($id, "text", "")->setAttributes([
		"class"=>"igk-winui-bmc-field__input"
	]);
	$noTag = $n->addNoTagNode();
	$noTag->setIndex(1000);	
	$noTag->add("label")
	->setAttributes(["for"=>$id])
	->setClass("logo")->Content = igk_svg_use($logo);
	$noTag->addBMCLineRipple();
	return $n;
}

function igk_html_node_BMCLineRipple(){
	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-line-ripple";	
	return $n;
}
///<summary>represent BMC shape component</summary>
function igk_html_node_BMCShape($type=null){
	//shape component
	
	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-shape";
	$x = $n->addNoTagNode();
	$x->setIndex(1000);	
	$x->addDiv()->setClass("igk-winui-bmc-shape__corner igk-winui-bmc-shape__corner_tl");
	$x->addDiv()->setClass("igk-winui-bmc-shape__corner igk-winui-bmc-shape__corner_bl");
	$x->addDiv()->setClass("igk-winui-bmc-shape__corner igk-winui-bmc-shape__corner_tr");
	$x->addDiv()->setClass("igk-winui-bmc-shape__corner igk-winui-bmc-shape__corner_br");
	return $n;
}

function igk_html_node_BMCButton(){
	$n = igk_createNode("button", null, func_get_args());
	$n["class"] = "igk-winui-bmc-button";
	return $n;
}

function igk_html_node_BMCRipple(){
	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-ripple";
	return $n;
}

function igk_html_node_BMCRadio($id, $value=null){
	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-radio";
	$n->Item = $n->addInput($id, "radio", $value);
	$n->addDiv()->setClass("radio__ripple");
	$n->addDiv()->setClass("radio__select");
	$n->addDiv()->setClass("radio__outline");	
	return $n;	
}


function igk_html_node_BMCTextarea($id, $value=null){
	extract(igk_html_extract_id($id));
	
	$n = igk_createNode();
	$n["class"] = "igk-winui-bmc-textarea";
	$a = $n->add("textarea")->setId($id);
	$a->Content = $value;
	if (isset($attribs)){
		$a->setAttributes($attribs);
	}
	$n->addBMCRipple();
	return $n;
}

function igk_html_node_BMCCheckbox($id, $value=null, $array=0){
	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-checkbox";	
	$i = $n->addInput($id, "checkbox", $value);
	
	if ($array){
		$i["name"]=$id."[]";
	}
	$n->Item = $i;
	$n->addDiv()->setClass("checkbox__ripple");
	$n->addDiv()->setClass("checkbox__select");
	$n->addDiv()->setClass("checkbox__outline");
 
	return $n;	
}


function igk_html_node_BMCSurface(){
	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-surface"; 
	return $n;
}

function igk_html_node_BMCToolTip(){
	$n = igk_createNode("igk-winui-bmc-tooltip");
	return $n;
}


function igk_html_node_BMCComboBox($id, $data=null, $index=null){

	$n = igk_createNode("div");
	$n["class"] = "igk-winui-bmc-textfield combobox";
	$n->select = $n->add("select");
	$n->select->setId($id);
	$index = $index ?? igk_get_form_args($id);
	
	if (is_array($data)){
		foreach($data as $k=>$v){
			$opt = $n->select->add("option");
			$opt->Content = $v;
			$opt["value"] = $k;
			
			if ($index == $k){
				$opt["selected"]=true;
			}
		}
	}
	
	$n->addBMCLineRipple();
	
	return $n;
}

function igk_html_node_BMCRoundtool(){
	$n = igk_createNode("div");
	$n["class"]="igk-winui-bmc-roundtool";
	return $n;
}
