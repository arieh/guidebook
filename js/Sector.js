function Sector(site, data){
    this.id = Sector.getID(site.id, data.name);
    this.name = data.name;
    this.data = data;
    this.site = site;

    this.generate();

    this.grades = {
        "5-6a" : 0,
        "6b-7a" : 0,
        "7b-7c" : 0,
        "8+" : 0
    };

    this.populateRoutes();
};

Sector.prototype = {
    template : '<div data-role="page" id="{id}">'+
            '<div data-theme="b" data-role="header">'+
                '<h3>{name}</h3>'+
                '<a data-role="button" data-inline="true" data-direction="reverse" data-rel="back" data-transition="slide" href="page1" data-icon="arrow-l" data-iconpos="left">Back</a>'+
            '</div>'+
            '<div data-role="content">'+
                '<div data-role="collapsible-set" data-theme="" data-content-theme="">'+
                    '<div data-role="collapsible" data-collapsed="true">'+
                        '<h3>Sector Map</h3>'+
                        '<div class="image"></div>'+
                    '</div>'+
                    '<div data-role="collapsible" data-collapsed="false">'+
                        '<h3>Routes</h3>'+
                        '<ol data-role="listview" data-divider-theme="b" data-inset="true" class="list">'+
                        '</ol>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>',
    item_template : '<li>{title}</li>', 
    generate : function(){
        this.element = $('#'+this.id);
        if (this.element.length){
            this.pregenerate = true;
        }else{
            this.element = $(
                this.template
                    .replace('{id}',this.id)
                    .replace('{name}',this.name)
            );
        }

        this.elements = {
            list : $('.list',this.element)        
        };

        $(document.body).append(this.element);
    },
    populateRoutes : function(){
        $.each(this.data.routes, this.addRoute.bind(this));
    },
    addRoute : function(index,route){
        var li =$(this.item_template.replace('{title}',route.name));

        this.elements.list.append(li);

        this.addToGrades(route.rating);
    },
    addToGrades : function(grade){
        if (grade < '6b'){
            this.grades['5-6a']++;    
        }else if (grade < '7b'){
            this.grades['6b-7a']++;    
        }else if (grade < '8'){
            this.grades['7b-7c']++;    
        }else{
            this.grades['8+']++;
        }
    }
};                                        

Sector.getID = function(site_id, name){
    return site_id + '_' + Site.getID(name);   
};
