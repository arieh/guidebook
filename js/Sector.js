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
    template : '<div data-role="page" id="{id}" data-type="sector" class="sector" data-parent="{parent}">'+
            '<div data-theme="b" data-role="header">'+
                '<h3>{name}</h3>'+
                '<a data-role="button" data-inline="true" data-direction="reverse" data-rel="back" data-transition="slide" href="page1" data-icon="arrow-l" data-iconpos="left">Back</a>'+
            '</div>'+
            '<div data-role="content">'+
                '<div data-role="collapsible-set" data-theme="" data-content-theme="">'+
                    '<div data-role="collapsible" data-collapsed="false">'+
                        '<h3>Sector Map</h3>'+
                        '<div class="image"></div>'+
                    '</div>'+
                '</div>'+
                '<h3>Routes</h3>'+
                '<ol data-inset="true" class="list" data-role="collapsible-set">'+
                '</ol>'+
            '</div>'+
        '</div>',
    item_template : '<li data-role="collapsible">'+
                        '<h4>{title} <span class="section grade">{grade}</span></h4>'+
                        "<div class='content'>"+
                            '<div class="data"><span class="section bolts">Bolts: {bolts}</span><span class="section length">Length: {length}</span><span class="section bolter">Bolted by: {bolter}</span></div>'+
                        "</div>"+
                    '</li>', 
    generate : function(){
        this.element = $('#'+this.id);
        if (this.element.length){
            this.pregenerate = true;
        }else{
            this.element = $(
                this.template
                    .replace('{id}',this.id)
                    .replace('{name}',this.name)
                    .replace('{parent}',this.site.id)
            );
        }

        this.elements = {
            list : $('.list',this.element),
            image : $('.image',this.element)
        };

        $(document.body).append(this.element);
    },
    populateRoutes : function(){
        $.each(this.data.routes, this.addRoute.bind(this));
    },
    addRoute : function(index,route){
        var li =$(
            this.item_template
                .replace('{title}',route.name)
                .replace('{bolts}',route.bolts || '?')
                .replace('{bolter}',route.bolter)
                .replace('{grade}',route.rating)
                .replace('{length}',route.length || "?")
            ),a;

        li.attr('id',Sector.getRouteID(this.id,route.name));

        if (route.comments){
            $('div.content',li).append($("<p>"+this.annotate(route.comments)+"</p>"));
        }

        if (route.length){
            $('h4',li).append($());    
        }

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
    },
    loadImage : function(){
        if (this.image_loaded) return;

        var img = new Image;
        img.src = 'images/sites/'+this.site.id+'/sectors/'+this.id+'.jpg';
        this.elements.image.append(img);

        this.image_loaded = true;
    },
    annotate : function(str){
        var $this = this;
        return str.replace(/#\{route:[^}]+\}/g, function(match){
            var regex = /\{route\:([^}]+)/,
                str = match.match(regex)[1],
                id = Sector.getRouteID($this.id,str);

            return "<a href='#"+id+"'>"+str+"</a>";
        });
    }
};                                        

Sector.getID = function(site_id, name){
    return site_id + '_' + Site.getID(name);   
};

Sector.getRouteID = function(sector_id, route){
    return sector_id + '_' + Site.getID(route);    
}
