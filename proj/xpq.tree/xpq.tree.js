$(function () {
	xpqTree.Init();
});

var xpqTree = new function () {
    this.nodeWidthActual = 95;
    this.data;
    this.nodeTemplate = '<div class="xpq-tree-node"><div class="body"><div class="head l"></div><div class="head r"></div><div class="tail"></div></div><div class="children"></div></div>';
    this.nodeAction = '<div id="xpq-tree-node-action"><a href="#" onclick="xpqTree.AddChild(this); return false;">add</a> | <a href="#" onclick="xpqTree.Delete(this); return false;">del</a></div>';

    this.Init = function () {
        this.data = this.NewNode(null, "root");
        this.UpdateGraph(this.data);

        $(".xpq-tree-node .body").live({
            mouseenter: function () {
                $(this).append(xpqTree.nodeAction);
            },
            mouseleave: function () {
                $("#xpq-tree-node-action").remove();
            }
        });

        if ($("#xpq-tree").hasClass("med"))
            this.nodeWidthActual = 131;
    };

    this.Delete = function (node) {
        var currentNode = this.FindNode($(node).parents(".xpq-tree-node")[0]);
        if (currentNode.parent != null) {
            var index = $(currentNode.parent.children).index(currentNode);
            currentNode.parent.children.splice(index, 1);
            this.UpdateGraph(this.data);
        }
    };

    this.AddChild = function (node) {
        var currentNode = this.FindNode($(node).parents(".xpq-tree-node")[0]);
        this.AddNode(currentNode, this.NewNode(currentNode, "test"));
    };

    this.FindNode = function (node) {
        if ($(node).parent().attr("id") == "xpq-tree")
            return xpqTree.data;
        else {
            var index = $(node).parent().children().index(node);
            var parent = this.FindNode($(node).parents(".xpq-tree-node")[0]);
            return parent.children[index];
        }
    };

    this.AddNode = function (parent, child) {
        if (!parent)
            parent = this.data;
        parent.children.push(child);
        this.UpdateGraph(this.data);
    };

    this.NewNode = function (parent, name) {
        return { "name": name, "parent": parent, "children": [] };
    };

    this.UpdateGraph = function (data, type, childrenWrapper) {
        if (childrenWrapper == undefined) {
            childrenWrapper = $("#xpq-tree");
            $("#xpq-tree").empty();
        }

        var node = $(this.nodeTemplate).clone();
        if (type != undefined)
            $(node).addClass(type)

        $(node).find(".body").append(data.name);
        var effectiveChildren = data.children.length;
        if (data.children.length == 0)
            $(node).addClass("leaf");
        else {
            var head = $(node).find(".body > .head").css("width", this.nodeWidthActual * data.children.length / 2);
            for (var i = 0; i < data.children.length; i++) {
                var type = "other";
                var on = false, ly = false;
                if (i == 0) {
                    type = "first";
                    on = true;
                }
                if (i == data.children.length - 1) {
                    type = "last";
                    ly = true;
                }
                if (on && ly)
                    type = "single";

                var grandChild = this.UpdateGraph(data.children[i], type, $(node).children(".children"));
                if (grandChild > 1)
                    effectiveChildren += grandChild - 1;
            }
            if (effectiveChildren > 1) {
                head.css("width", this.nodeWidthActual * effectiveChildren / 2);
            }
        }

        $(childrenWrapper).append(node);

        return effectiveChildren;
    }
};