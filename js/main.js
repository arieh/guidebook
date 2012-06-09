function bind(that){
    var self = this,
        args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : null,
        F = function(){}, bound;

    bound = function(){
        var context = that, length = arguments.length, result;
        if (this instanceof bound){
            F.prototype = self.prototype;
            context = new F();
        }

        result = (!args && !length)
            ? self.call(context)
            : self.apply(context, args && length ? args.concat(Array.prototype.slice.call(arguments, 0)) : args || arguments);
        
        return context == that ? result : context;
    };

    return bound;
}

if (false === ('bind' in Function.prototype)){
    Function.prototype.bind = bind;    
} 

function Main(){
    this.generate();

    this.sites = {};

    this.handles = {
        site : this.siteLoad.bind(this),
        sector : this.sectorLoad.bind(this)
    };

    $( document ).bind( "pagebeforechange", this.pageChange.bind(this));

    this.load(toc);
}

Main.prototype = {
    template : '<div data-role="page" id="main">'+
               '<div data-theme="a" data-role="header"><h3>Guidebook</h3></div>'+
               '<div data-role="content">'+
                    '<ul data-role="listview" data-divider-theme="b" data-inset="true" class="list">'+
                    '<li data-role="list-divider" role="heading">Sites</li></ul>'+
               '</div>', 
    site_template : '<li data-theme="c"><a href="#{id}" data-transition="slide">{title}</a></li>',
    generate : function(){
        this.element = $(this.template);
        this.elements = {
            list : $('.list', this.element)    
        };

        $(document.body).append(this.element);
    },
    load : function(data){
        this.data = data;

        data.forEach(this.addSite.bind(this));
    },
    addSite : function(site){
        var el; 
        
        site = new Site(site);
        el = $(this.site_template.replace('{id}', site.id).replace('{title}',site.name));
        
        this.sites[site.id] = site;

        this.elements.list.append(el);
    },

    pageChange : function(e,data){
        var el = $(data.toPage[0]),
            type = el.attr('data-type'),
            handle = this.handles[type],
            id = el.attr('id');
        
        if (!handle) return;

        handle(id,el);
    },

    siteLoad : function(id){
        this.sites[id].loadSectors();
    },

    sectorLoad : function(id,el){
        var parent = el.attr('data-parent'),
            site = this.sites[parent],
            sector = site.sectors[id];

        sector.loadImage();
    }
};
