using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageViewer.API.Models
{
    public class ImageModel
    {
        public string Key { get; set; }
        public long Size { get; set; }
        public DateTime LastModified { get; set; }
        public string ETag { get; set; }
        public List<ImageTag> Tags { get; set; }
    }

    public class ImageTag
    {
        public string Tag { get; set; }
        public string Value { get; set; }
    }

}
