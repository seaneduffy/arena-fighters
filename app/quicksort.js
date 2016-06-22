'use strict';

function quickSort(items, left, right, evaluate) {
    var index;

    if (items.length > 1) {

        index = partition(items, left, right, evaluate);
		
        if (left < index - 1) {
            quickSort(items, left, index - 1, evaluate);
        }

        if (index < right) {
            quickSort(items, index, right, evaluate);
        }

    }

    return items;
}

function partition(items, left, right, evaluate) {
	
    var pivot   = !!evaluate ? items[Math.floor((right + left) / 2)][evaluate] : items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;

    while (i <= j) {
		
		let iValue = !!evaluate ? items[i][evaluate] : items[i],
			jValue = !!evaluate ? items[j][evaluate] : items[j];
			
        while (iValue < pivot) {
			i++;
			iValue = !!evaluate ? items[i][evaluate] : items[i];
        }
        while (jValue > pivot) {
            j--;
			jValue = !!evaluate ? items[j][evaluate] : items[j];
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function find(value, items, evaluate) {
	let itemsLength = items.length,
		i = Math.floor((itemsLength-1) / 2),
		item = items[i],
	compareValue = !!evaluate ? item[evaluate] : item;

	if(value === compareValue) {
		return item;
	} else if(value > compareValue) {
		while(i < itemsLength-1) {
			i++;
			item = items[i];
			compareValue = !!evaluate ? item[evaluate] : item;
			if(compareValue === value)
				return item;
		}
	} else {
		while(i > 0) {
			i--;
			item = items[i];
			compareValue = !!evaluate ? item[evaluate] : item;
			if(compareValue === value)
				return item;
		}
	}
	return false;
}

function swap(items, firstIndex, secondIndex){
    let temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

module.exports = {
	sort: function(arr, evaluate) {
		return quickSort(arr, 0, arr.length-1, evaluate);
	},
	find: function(value, arr, evaluate) {
		return find(value, arr, evaluate);
	}
}