(function(){
    var last_check_idx = 0,
    MainCheckbox = function(obj){
        var cobj = obj,
        select_class = {selected:"selected",part:"selected-part",hot:"checkbox-hot"};
        add_sub_checkbox = function(class_name)
        {}
        cobj.bg = $(cobj).children(0);
        cobj.selected = false;
        cobj.selected_part = false;
        cobj.checked_sub_count = 0;
        cobj.set_selected = function(){
            cobj.bg.set_bg_selected();
            cobj.add_hot();
            cobj.selected = true;
            cobj.selected_part = false;
            
        };
        cobj.set_selected_part = function(){
            cobj.bg.set_bg_selected_part();
            cobj.add_hot();
            cobj.selected = false;
            cobj.selected_part = true;
        }
        cobj.set_selected_none = function(){
            cobj.bg.set_bg_selected_none();
            cobj.remove_hot();
            cobj.selected = false;
            cobj.selected_part = false;
            
        }
        cobj.add_hot = function(){
            $(cobj).addClass(select_class.hot);
        }
        cobj.remove_hot = function(){
            $(cobj).removeClass(select_class.hot);
        }
        cobj.bg.set_bg_selected = function(){
            $(this).removeClass(select_class.part);
            $(this).addClass(select_class.selected);
        }
        cobj.bg.set_bg_selected_part = function(){
            $(this).removeClass(select_class.selected);
            $(this).addClass(select_class.part);
        }
        cobj.bg.set_bg_selected_none = function(){
            $(this).removeClass(select_class.selected);
            $(this).removeClass(select_class.part);
        }
        $(cobj).bind("subCheckChanged", function(event,selected_area){
            if (selected_area.selected)
                cobj.checked_sub_count ++;
            else
                cobj.checked_sub_count --;
            if (cobj.checked_sub_count == cobj.sub_count){
                cobj.set_selected();
            }
            else if (cobj.checked_sub_count == 0){
                cobj.set_selected_none();
            }
            else{
                cobj.set_selected_part();
            }
        });
        $(cobj).click(function(){
            cobj.checked_sub_count = 0;
            if (cobj.selected_part){
                cobj.set_selected_none();
                $(cobj).trigger("onAllUnSelected");
            }
            else if (cobj.selected)
            {
                cobj.set_selected_none();
                $(cobj).trigger("onAllUnSelected");
            }
            else{
                cobj.set_selected();
                $(cobj).trigger("onAllSelected");
            }
            
            $(".sub-checkbox").trigger("mainCheckChanged", cobj.selected);
        });
        return cobj;
    },
    SubCheckbox = function(obj)
    {
        var cobj = obj,
        select_class = {selected:"selected",hot:"checkbox-hot"};
        cobj.bg = $(obj).children(0);
        cobj.selected = false;
        cobj.set_selected = function(){
            cobj.bg.set_bg_selected();
            cobj.add_hot();
            cobj.selected = true;
            cobj.selected_part = false;
            
        };
        cobj.set_selected_none = function(){
            cobj.bg.set_bg_selected_none();
            cobj.remove_hot();
            cobj.selected = false;
            cobj.selected_part = false;
            
        }
        cobj.bg.set_bg_selected = function(){
            $(this).addClass(select_class.selected);
        }
        cobj.bg.set_bg_selected_none = function(){
            $(this).removeClass(select_class.selected);
        }
        cobj.add_hot = function(){
            $(cobj).addClass(select_class.hot);
        }
        cobj.remove_hot = function(){
            $(cobj).removeClass(select_class.hot);
        }
        $(cobj).bind("mainCheckChanged", function(event, selected){
            if (selected){
                cobj.set_selected();
            }
            else{
                cobj.set_selected_none();
            }
        });
        cobj.do_check = function(selected)
        {
            if (selected){
                cobj.set_selected_none();
               //$(cobj).trigger("onUnSelected");
            }
            else{
                cobj.set_selected();
               // $(cobj).trigger("onSelected");
            }
        }
        $(cobj).click(function(){
            cobj.do_check(cobj.selected);
            if (cobj.selected)
                $(cobj).trigger("onSelected");
            else
                $(cobj).trigger("onUnSelected");
            if (wobj.is_shift)
                $(document).trigger("mulitCheck", {last:cobj.index,pre:last_check_idx,checked:!cobj.selected});
            last_check_idx = cobj.index;
            $(".main-checkbox").trigger("subCheckChanged", cobj.selected);

        });
        return cobj;
    },
    init_main_checkbox = function(class_name)
    {
        return MainCheckbox($("." + class_name));
    },
    init_sub_checkboxs = function(class_name)
    {
        var sub_checkboxs = [];
        $("." + class_name).each(function(e,x){
            var subChb = SubCheckbox($(this))
            subChb.index = e;
            sub_checkboxs.push(subChb);
        });
        return sub_checkboxs;
    },
    init_checkbox = function(main_class, sub_class)
    {
        set_keyboard();
        var cb = {};
        cb.main = init_main_checkbox(main_class);
        cb.subs = init_sub_checkboxs(sub_class);
        cb.main.sub_count = cb.subs.length;
        $(document).bind("mulitCheck", function(event, area){
            start = Math.min(area.last,area.pre);
            end = Math.max(area.last,area.pre);
            for (var i = start; i < end; i ++)
            {
                var s = cb.subs[i];
                s.do_check(area.checked);
            }
            $(cb.main).trigger("subCheckChanged", area);
            $(document).trigger("afterMulitCheck", area);
        });
        cb.add_sub = function(obj)
        {  
            var sub = SubCheckbox($(obj));
            sub.index = cb.subs.length + 1;
            cb.main.sub_count = sub.index;
            cb.subs.push(sub);
        }
        return cb;
    }
    checkbox_init = function(main_class, sub_class)
    {
        return init_checkbox(main_class, sub_class)
    }
    
} 
)();