function Site(data){
    this.data = data;
    this.name = this.data.name;
    this.id   = Site.getID(this.name); 
    this.sectors = {}; 
    this.generate();
    this.populateSectors();
    this.populateGrades(); 
 
}

Site.prototype = {
    template : '<div id={id} data-role="page" class="site" data-type="site"><div data-role="header">'+
                    '<a data-role="button" data-inline="true" data-direction="reverse" data-rel="back" data-transition="slide" data-theme="b" href="page1" data-icon="arrow-l" data-iconpos="left">Back</a>'+
                    '<h3>{name}</h3>'+
               '</div>'+                    
               '<div data-role="content">'+               
                   '<div data-role="collapsible-set" data-theme="" data-content-theme="">'+
                        '<div data-role="collapsible" data-collapsed="true">'+
                            '<h3>Location</h3>'+
                            '<a href="https://maps.google.com/?q={location}" target="_blank"><img src="https://maps.googleapis.com/maps/api/staticmap?center={location}&zoom=14&size=288x200&maptype=terrain&markers=color:blue|label:S|{location}&sensor=false" height="200" width="288" /></a>'+
                        '</div>'+
                        '<div data-role="collapsible" data-collapsed="true">'+
                            '<h4>Site Map</h4>'+
                            '{map}'+
                        '</div>'+
                        '<div data-role="collapsible data-collapsed="false">'+
                            '<h3>Grades</h3>'+
                            '<div class="grades"></div>'+
                        '</div>'+
                   '</div>'+
                   '<h3>Sectors</h3>'+
                   '<div data-role="listview" data-inset="true" class="list"></div>'+
               '</div></div>',
    item_template : '<li><a data-transition="slide" href="#{id}">{title}</a></li>',
    generate : function(){
        this.element = $('#'+this.id);
        if (this.element.length){
            this.preloaded = true;    
        }else{
            this.element = $(
                this.template
                    .replace('{id}', this.id)
                    .replace('{name}',this.name)
                    .replace(/\{location\}/g,this.data.location.join(","))
                    .replace('{map}',"<img src='images/sites/"+this.id+"/map.jpg'/>")
            );
        }

        this.elements = {
            list : $('.list', this.element),
            grades : $('.grades',this.element)
        };

        $(document.body).append(this.element);
    },

    loadSectors : function(){
        if (this.populated) return;

        this.populated = true;
    },

    populateSectors : function(){
        $.each(this.data.sectors,this.createSector.bind(this));
    },
    createSector : function(index,data){
        var sector = new Sector(this,data),
            el = $(this.item_template.replace('{id}',sector.id).replace('{title}',sector.name)),
            a = $('a',el);

        this.sectors[sector.id] = sector;

        $.each(sector.grades, function(name,number){
            if (number == 0) return;
            a.append(
                $('<span class="section">{name}: {number}</span>'.replace('{name}',name).replace('{number}',number))
            );
        });

        this.elements.list.append(el);
    },
    populateGrades : function(){
        var grades = {}, names=[], html='', letters =['a','b','c','d'];
        $.each(this.sectors,function(name,sector){
            $.each(sector.grades,function(name,value){
                if (value == 0) return;

                if (!grades[name]){
                    grades[name] = +value;
                    names.push(name);
                }else{
                    grades[name]+=value;   
                }
            }.bind(this));
        }.bind(this));    

        this.elements.grades.addClass('ui-grid-'+letters[names.length-1]);

        $.each(names, function(i,name){
            html+='<div class="ui-block-'+letters[i]+' grid-block"><h4>'+name+'</h4></div>';        
        }.bind(this));

        $.each(names, function(i, name){
            html+='<div class="ui-block-'+letters[i]+' grid-block">'+grades[name]+'</div>';    
        });

        this.elements.grades.html(html);
    }
};

Site.getID = function(name){
    return name.toLowerCase().replace(/\s+/g,'-').replace(/([^\-a-z])/g,'');
};

