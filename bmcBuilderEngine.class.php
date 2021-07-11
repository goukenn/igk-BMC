<?php
 
// desc: use to call dxsl definitoin data
// author : C.A.D BONDJE DOUE
// license: Balafon @ copyright 2019

class BMCFormBuilderEngine extends IGKFormBuilderEngine{
	
	public function addGroup(){
		$this->group = $this->frm->addDiv()->setClass("igk-bmc-form-group");		
		return $this;
	}
	
	public function addControl($id, $value=null, $type="text", $style=null){		
		$view = $this->getView();
		if (is_array($id)){
			if (!array_key_exists("id", $id)){
				igk_die("require id for the label");
			}
		}else{
			if ($value!=null){ // use of form args
				igk_set_form_value($id, $value);
			}
		}
		switch($type){
			case "button":
				$view->addBMCButton($id);
				break;
			case "radio":
				$view->addBMCRadio($id);
				break;
			case "checkbox":
				$view->addBMCCheckbox($id);
				break;
			default:
			case "text":
				 $view->addBMCTextfield($id, "text", $style);
			break;
		}		
		return $this;	
	}
	protected function _loadAttribs($t, $s=null){
		$attr = $s? igk_getv($s, "attribs"): null;
		if($attr){ 
			$t->setAttributes($attr);
		} 
	}
	public function addLabel($id, $class=null, $settings = null){
		$l = $this->getView()->add("label");
		$this->_initLabel($l, $id, null);
		// $l["clFor"] = $id;
		// $l["id"] = "lb-".$id;
		// $l["class"] = "+lb-".strtolower($id);
		// if ($class)
			// $l["class"] = $class;
		// $content= $settings ? igk_getv($settings, "text", R::gets($id)) : R::gets($id);		
		// $l->setContent($content);	
		return $this;
	}
	///<summary>addLabelControl </summary>
	///<param name="id">mixed: string or array of properties</param>
	public function addLabelControl($id, $value=null, $type='text', $style=''){		
		$this->addControl($id, $value, $type, null, $style);
		return $this;
	}
	public function addLabelSelect($id, $entries, $filter=null){
		//filter properties
		//{
			// text: text for the label
			// key: key or callback for display value:  default is clName
			// value: key for option value: default is clId
			// attribs: {} // object or attribute to bind to select 
		// } 
		// $this->addLabel($id, "lb-".strtolower($id), $filter);
		$c = $this->getView()->addBMCCombobox($id);			
		$this->_loadAttribs($c->select, $filter);
		$this->_initEntries($c->select, $entries, $filter, $id);
		return $this;
	}
	public function addTextarea($id, $value=null){
		$c = $this->getView()->addBMCTextarea($id);
		$c->addBMCLineRipple();
		return $this;
	}
	
	public function addCombobox($id, $entries, $filter=null){
		$c = $this->getView()->addBMCCombobox($id);
		$this->_initEntries($c->select, $entries, $filter, $id);
		return $this;
	}
	
	public function addCheckbox($id, $value=0, $filter=null){
		$c = $this->getView();
		$c->addBMCCheckbox($id,$value);
		$lb = $c->add('label');
		$this->_initLabel($lb, $id, $filter);
		return $this;
	}
	
	private function _initLabel($l, $id, $settings=null, $class=null){
		$l["clFor"] = $id;
		$l["id"] = "lb-".$id;
		$l["class"] = "+lb-".strtolower($id);
		if ($class)
			$l["class"] = $class;
		if (!($content = ($settings ? igk_getv($settings, "text"): null)))
			$content = R::gets($id);
		$l->setContent($content);	
	}
}

igk_reg_form_builder_engine("bmc", BMCFormBuilderEngine::class);
