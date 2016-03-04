;
!function(wnd, $, undefined){
    var autoSubmit = wnd.eFiltrAutoSubmit||1;
    var useAjax = wnd.eFiltrAjax;
    var eFilter = function(options) {
        this.Init(options);
    }
    eFilter.prototype = {
        constructor : eFilter,
        defaults : {
            block : "#eFiltr",
            form : "form#eFiltr",
            form_selector : "form#eFiltr input, form#eFiltr select",
            result_list : "#eFiltr_results",
            loader : "#eFiltr_results_wrapper .eFiltr_loader"
        },
        params : {},
        Init : function(options) {
            this.params = $.extend({}, this.defaults, options);
            this.params = $.extend(this.params,
                {
                    block_obj : $(this.params.block),
                    form_obj : $(this.params.form),
                    form_selector_obj : $(this.params.form_selector),
                    result_list_obj : $(this.params.result_list),
                    loader_obj : $(this.params.loader)
                }
            );
            this.checkActions();
        },
        checkActions : function() {
            this.checkPagination();
            this.checkForm();
            this.checkSort();
        },
        checkPagination : function() {
            var self = this;
            $(document).on("click", ".paginate a", function(e){
                if (typeof useAjax !== 'undefined') {
                    e.preventDefault();
                    var _form = '';
                    var data2 = '&no_ajax_for_star_rating=1';
                    var action = $(this).attr("href");
                    self.makeAjax(action, data2, _form, "POST");
                }
            })
        },
        checkForm : function() {
            var self = this;
            $(document).on("change", this.params.form_selector, function(e) {
                if (typeof autoSubmit !== 'undefined') {
                    self.submitForm();
                }
            })
        },
        checkSort : function() {
            
        },
        submitForm : function() {
            var self = this;
            $(document).on("submit", this.params.form, function(e){
                if (typeof useAjax !== 'undefined') {
                    e.preventDefault();
                    var _form = $(this);
                    var data2 = _form.serialize() + '&no_ajax_for_star_rating=1';
                    var action = _form.attr("action");
                    self.makeAjax(action, data2, _form, "GET", "all");
                }
            })
            this.params.form_obj.submit();
        },
        makeAjax : function(action, data2, _form, type, updateAll) {
            var self = this;
            $.ajax({
                url: action,                                   
                data: data2,
                type: type,   
                beforeSend:function() {
                    self.prepareBeforeSend(_form, updateAll);
                },                   
                success: function(msg) {
                    self.updateAfterSuccess(msg, _form, updateAll);
                }
            })
        },
        blurBlocks : function() {
            this.params.form_obj.css({'opacity' : '0.5'});
            this.params.result_list_obj.css({'opacity' : '0.5'});
        },
        unblurBlocks : function() {
            this.params.form_obj.css({'opacity' : '1'});
            this.params.result_list_obj.css({'opacity' : '1'});
        },
        showLoader : function() {
            this.params.loader_obj.show();
        },
        hideLoader : function() {
            this.params.loader_obj.hide();
        },
        insertResult : function(msg, selector) {
            $(selector).html($(msg).find(selector).html());
        },
        updateAfterSuccess : function(msg, _form, updateAll) {
            if (typeof afterFilterSend == 'function') {
                afterFilterSend(msg);
            }
            this.hideLoader();
            this.insertResult(msg, this.params.result_list);
            if (typeof updateAll !== 'undefined') {
                this.insertResult(msg, this.params.form);
            }
            this.unblurBlocks();
            if (typeof(afterFilterComplete) == 'function') {
                afterFilterComplete(_form);
            }
        },
        prepareBeforeSend : function(_form, updateAll) {
            if (typeof beforeFilterSend == 'function') {
                beforeFilterSend(_form);
            }
            this.blurBlocks();
            this.showLoader();
        },
        
    }
    $(function () {
        wnd.eFilter = new eFilter();
    })
}(window, jQuery);
