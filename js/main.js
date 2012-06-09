function Main(){
    this.generate();

    this.sites = {};

    // $.getJSON('./toc.json', this.load.bind(this));
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
        var site = new Site(site),
            el = $(this.site_template.replace('{id}', site.id).replace('{title}',site.name));
        
        this.sites[site.id] = site;

        this.elements.list.append(el);
    }
};
