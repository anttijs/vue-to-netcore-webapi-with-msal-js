    export default 
{
    schema: null,
    title(name) {
        if (this.schema && this.schema.Props) {
            let x = this.schema.Props.find(x => {return x.Name === name}) 
            if (x !== undefined) {
                if (x.Title === undefined || x.Title === null)
                    return name
                return x.Title
            }            
        }
        return name
    },
    inputType(name) {
        if (this.schema && this.schema.Props) {
            let x = this.schema.Props.find(x => {return x.Name === name}) 
            if (x !== undefined) {
                if (x.Type === undefined || x.Type === null)
                    return 'text'
                if (x.Type === 'Date')
                    return 'date'
                if (x.Type === "Int32")
                    return 'number'
            }            
        }
        return 'text'
    },
    selectOptions(name) {
        if (this.schema && this.schema.Props) {
            let x = this.schema.Props.find(e => {return e.Name === name})
            if (x !== undefined) {
                return x.PropEnums
            }            
        }
    }
};